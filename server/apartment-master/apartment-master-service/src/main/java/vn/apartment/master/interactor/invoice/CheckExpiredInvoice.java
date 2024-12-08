package vn.apartment.master.interactor.invoice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.core.redis.publisher.RedisEventPublisher;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.dto.invoice.InvoiceStatus;
import vn.apartment.master.dto.resident.ResidentInfo;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Invoice;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.mapper.ServiceDetailMapper;
import vn.apartment.master.service.*;
import vn.apartment.master.util.Locales;
import vn.apartment.notification.dto.event.MailEvent;
import vn.apartment.notification.dto.mail.MailDTO;
import vn.apartment.notification.dto.mail.Priority;
import vn.apartment.notification.dto.template.RemindMailTemplate;

import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

@Interactor
public class CheckExpiredInvoice {

    private static final Logger LOG = LoggerFactory.getLogger(CheckExpiredInvoice.class);

    public static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd-MMM-yy");

    @Autowired
    private ServiceDetailService serviceDetailService;
    @Autowired
    private ServiceDetailMapper serviceDetailMapper;
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private RecordService recordService;
    @Autowired
    private RenterService renterService;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private RedisEventPublisher publisher;
    @Autowired
    private InvoiceSettingService invoiceSettingService;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void execute() {
        LOG.info("Starting check expired records job");
        try {
            Calendar calendar = Calendar.getInstance();
            calendar.set(Calendar.HOUR_OF_DAY, 0);
            calendar.set(Calendar.MINUTE, 0);
            calendar.set(Calendar.SECOND, 0);
            calendar.set(Calendar.MILLISECOND, 0);
            Date startOfDay = calendar.getTime();
            calendar.add(Calendar.DAY_OF_MONTH, 1);
            Date endOfDay = calendar.getTime();
            List<Invoice> expiringInvoices = invoiceService.getByPaymentDeadline(startOfDay, endOfDay, InvoiceStatus.UNPAID);
            LOG.info("Found {} invoices expiring today", expiringInvoices.size());
            List<Invoice> updatedInvoices = expiringInvoices.stream()
                    .map(invoice -> {
                        try {
                            Apartment hadApartment = apartmentService.findApartmentByInvoice(invoice.getInvoiceId());
                            hadApartment.setStatus(ApartmentStatus.WARNING);
                            invoice.setStatus(InvoiceStatus.EXPIRED);
                            BigDecimal penaltyFee = calculatePenaltyFee(invoice.getTotal(),
                                    invoiceSettingService.getInvoiceSetting().getPenaltyFeePercentage());
                            invoice.setPenaltyFee(penaltyFee);
                            invoice.setTotal(invoice.getTotal().add(penaltyFee));
                            LOG.debug("Marking invoice {} as expired", invoice.getInvoiceId());
                            invoice.setApartment(hadApartment);
                            sendMail(invoice);
                            return invoice;
                        } catch (Exception e) {
                            LOG.error("Error processing invoice {}: {}",
                                    invoice.getInvoiceId(), e.getMessage());
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            if (!updatedInvoices.isEmpty()) {
                invoiceService.saveAll(updatedInvoices);
                LOG.info("Successfully updated {} expired invoices", updatedInvoices.size());
            }
        } catch (Exception e){
            LOG.error("Error in check expired invoices job: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to process expired invoices", e);
        }
    }

    private void sendMail(Invoice invoice) {

        ResidentInfo residentInfo = new ResidentInfo();

        List<ServiceDetailDTO> serviceDetailDTOs =
                serviceDetailService.getServiceDetailByApartment(invoice.getApartment().getApartmentId())
                        .stream()
                        .map(serviceDetailMapper::toDTO)
                        .collect(Collectors.toList());

        Owner hadOwner = ownerService.findOwnerByApartment(invoice.getApartment().getApartmentId());

        if (!hadOwner.getOccupancy().equals(Boolean.TRUE)) {
            Record hadRecord = recordService.findRecordByOwner(hadOwner.getOwnerId());
            Renter hadRenter = renterService.findRenterByRecord(hadRecord.getRecordId());
            residentInfo.setName(hadRenter.getLastName());
            residentInfo.setEmail(hadRenter.getEmail());
        } else {
            residentInfo.setName(hadOwner.getLastName());
            residentInfo.setEmail(hadOwner.getEmail());
        }

        try {
            MailDTO mail = makeNewMail(invoice, residentInfo, invoice.getApartment().getName(), serviceDetailDTOs);
            MailEvent event = newEvent(mail);
            publisher.publish(event);
            LOG.info("Published the mail message {} .", event.getId());

        } catch (Exception exception) {
            LOG.error("Couldn't send mail", exception);
        }
    }

    private MailEvent newEvent(MailDTO mail) {
        MailEvent event = MailEvent.standard();
        event.setId(Generators.uuid());
        event.setPayload(mail);
        event.setSource("master");
        event.setType("SENT_INVOICE");
        return event;
    }

    private MailDTO makeNewMail(Invoice info, ResidentInfo residentInfo,
                                String apartmentName, List<ServiceDetailDTO> serviceDetails) {
        return MailDTO.mail()
                .tos(residentInfo.getEmail())
                .priority(Priority.HIGHEST)
                .subject(getSubject(apartmentName))
                .templateId(RemindMailTemplate.REMIND_INVOICE_TEMPLATE.id())
                .parameter("resident_name", residentInfo.getName())
                .parameter("apartment_name", apartmentName)
                .parameter("payment_deadline", format(info.getPaymentDeadline()))
                .parameter("created_date", format(info.getCreateDate()))
                .parameter("status", info.getStatus())
                .parameter("total", info.getTotal())
                .parameter("penalty_fee", info.getPenaltyFee())
                .parameter("extra_payment_deadline", format(info.getExtraPaymentDeadline()))
                .parameter("service_details", serviceDetails);
    }

    private String getValue(String value, String defValue) {
        return ObjectUtils.isEmpty(value) ? defValue : value;
    }

    private String getSubject(String apartmentName) {
        return messageSource.getMessage(Locales.MAIL_INVOICE_NOTIFICATION,
                new String[]{apartmentName}, Locale.ENGLISH);
    }

    public static String format(Date date) {
        return DATE_FORMAT.format(date);
    }

    public BigDecimal calculatePenaltyFee(BigDecimal totalAmount, double penaltyFeePercentage) {
        return totalAmount.multiply(BigDecimal.valueOf(penaltyFeePercentage / 100));
    }
}
