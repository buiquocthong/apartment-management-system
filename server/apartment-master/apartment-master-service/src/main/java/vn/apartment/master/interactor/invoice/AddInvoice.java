package vn.apartment.master.interactor.invoice;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.core.redis.publisher.RedisEventPublisher;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.dto.invoice.AddInvoiceDTO;
import vn.apartment.master.dto.invoice.InvoiceStatus;
import vn.apartment.master.dto.resident.ResidentInfo;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Invoice;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.entity.service.ServiceDetail;
import vn.apartment.master.entity.setting.InvoiceSetting;
import vn.apartment.master.mapper.InvoiceMapper;
import vn.apartment.master.mapper.ServiceDetailMapper;
import vn.apartment.master.service.*;
import vn.apartment.master.util.Locales;
import vn.apartment.notification.dto.event.MailEvent;
import vn.apartment.notification.dto.mail.MailDTO;
import vn.apartment.notification.dto.mail.Priority;
import vn.apartment.notification.dto.template.InvoiceMailTemplate;
import vn.apartment.payment.client.PaymentClient;
import vn.apartment.payment.client.dto.PaypalRequest;
import vn.apartment.payment.client.dto.PaypalResponse;

import java.math.BigDecimal;
import java.util.*;
import java.text.SimpleDateFormat;
import java.util.stream.Collectors;

@Interactor
public class AddInvoice {

    private static final Logger LOG = LoggerFactory.getLogger(AddInvoice.class);

    public static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("dd-MM-yyyy", Locale.ENGLISH);

    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private InvoiceMapper invoiceMapper;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private ServiceDetailService serviceDetailService;
    @Autowired
    private ServiceDetailMapper serviceDetailMapper;
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private RecordService recordService;
    @Autowired
    private RenterService renterService;
    @Autowired
    private MessageSource messageSource;
    @Autowired
    private RedisEventPublisher publisher;
    @Autowired
    private InvoiceSettingService invoiceSettingService;
    @Autowired
    private PaymentClient paypalClient;

    public void execute(AddInvoiceDTO invoiceDTO){
        if (invoiceDTO ==null){
            throw new InvalidParameterException("The request body is missing.");
        }
        Invoice invoice = saveNewInvoice(invoiceDTO);
        sendMail(invoice);
        updateServiceDetail(invoiceDTO.getApartmentId());
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
                .templateId(InvoiceMailTemplate.ADD_INVOICE_TEMPLATE.id())
                .parameter("resident_name", residentInfo.getName())
                .parameter("apartment_name", apartmentName)
                .parameter("payment_deadline", format(info.getPaymentDeadline()))
                .parameter("created_date", format(info.getCreateDate()))
                .parameter("status", info.getStatus())
                .parameter("total", info.getTotal())
                .parameter("service_details", serviceDetails)
                .parameter("payment_url", generatePayPalPaymentUrl(info));
    }

    private String getValue(String value, String defValue) {
        return ObjectUtils.isEmpty(value) ? defValue : value;
    }

    private String getSubject(String apartmentName) {
        return messageSource.getMessage(Locales.MAIL_INVOICE_NOTIFICATION,
                new String[]{apartmentName}, Locale.ENGLISH);
    }

    @Transactional
    public Invoice saveNewInvoice(AddInvoiceDTO invoiceDTO) {

        Apartment hadApartment = apartmentService.findApartmentById(invoiceDTO.getApartmentId());

        if (hadApartment.getStatus().equals(ApartmentStatus.AVAILABLE)) {
            throw new InvalidParameterException("Apartment is available");
        }

        if (invoiceService.retrieveInvoiceByApartmentId(hadApartment.getApartmentId()).isPresent()){
            Invoice hadInvoice =  invoiceService.findLastedInvoiceByApartment(hadApartment.getApartmentId());
            if (hadInvoice.getStatus().equals(InvoiceStatus.EXPIRED) || hadInvoice.getStatus().equals(InvoiceStatus.UNPAID)) {
                throw new InvalidParameterException("Now invoice is waiting to be payment");
            }
            hadInvoice.setDeleted(true);
            invoiceService.saveOrUpdate(hadInvoice);
        }

        InvoiceSetting invoiceSetting = invoiceSettingService.getInvoiceSetting();

        Invoice invoice = invoiceMapper.toEntity(invoiceDTO);
        invoice.setInvoiceId(Generators.uuid());
        invoice.setApartment(hadApartment);
        invoice.setInvoiceSetting(invoiceSetting);
        invoice.setPenaltyFee(BigDecimal.ZERO);

        List<ServiceDetail> serviceDetails = serviceDetailService.getServiceDetailByApartment(invoiceDTO.getApartmentId());

        BigDecimal totalAmount = calculateTotalAmount(serviceDetails);

        Date extraPaymentDeadline = calculateExtraPaymentDeadline(invoice.getPaymentDeadline(), invoiceSetting.getMaxExpiredTime());

        invoice.setTotal(totalAmount);
        invoice.setExtraPaymentDeadline(extraPaymentDeadline);

        return invoiceService.saveOrUpdate(invoice);
    }

    public static String format(Date date) {
        return DATE_FORMAT.format(date);
    }

    public BigDecimal calculateTotalAmount(List<ServiceDetail> serviceDetails) {
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (ServiceDetail serviceDetail : serviceDetails) {
            totalAmount = totalAmount.add(serviceDetail.getMoney());
        }
        return totalAmount;
    }

    public Date calculateExtraPaymentDeadline(Date paymentDeadline, int maxExpiredTime) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(paymentDeadline);
        calendar.add(Calendar.DAY_OF_YEAR, maxExpiredTime);
        return calendar.getTime();
    }

    private String generatePayPalPaymentUrl(Invoice invoice) {
        PaypalRequest paymentRequest = new PaypalRequest();
        paymentRequest.setAmount(invoice.getTotal().toString());
        paymentRequest.setInvoiceId(invoice.getInvoiceId());
        PaypalResponse response = paypalClient.createPayment(paymentRequest);
        return response.getMessage();
    }

    private void updateServiceDetail(final String apartmentId){
        List<ServiceDetail> serviceDetails = serviceDetailService.getServiceDetailByApartment(apartmentId);
        for (ServiceDetail serviceDetail : serviceDetails) {
            if (serviceDetail.getService().getMeteredService().equals(Boolean.TRUE)) {
                serviceDetail.setOldValue(serviceDetail.getNewValue());
                serviceDetailService.saveOrUpdate(serviceDetail);
            }
        }
    }
}
