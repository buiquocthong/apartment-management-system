package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dao.InvoiceRepo;
import vn.apartment.master.dto.invoice.InvoiceStatus;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Invoice;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import static vn.apartment.master.dao.spec.InvoiceQuerySpec.newSpecification;
import static vn.apartment.master.dao.spec.InvoiceQuerySpec.supportedFields;

@Service
public class InvoiceService {

    private static final Logger LOG = LoggerFactory.getLogger(InvoiceService.class);

    @Autowired
    private InvoiceRepo invoiceRepo;
    @Autowired
    private ApartmentService apartmentService;

    public Invoice saveOrUpdate(Invoice invoice) {
        return invoiceRepo.save(invoice);
    }

    public void delete(final String invoiceId) {
        Invoice hadInvoice = findInvoiceById(invoiceId);
        hadInvoice.setDeleted(true);
    }

    public void saveAll(List<Invoice> invoices) {
        invoiceRepo.saveAll(invoices);
    }

    public List<Invoice> getOldInvoiceByApartment(final String apartmentId) {
        Apartment hadApartment = apartmentService.findApartmentById(apartmentId);
        return invoiceRepo.findOldInvoicesByApartmentId(apartmentId);
    }

    public List<Invoice> getByPaymentDeadline(Date startOfDate, Date endOfDate, InvoiceStatus status) {
        return invoiceRepo.findByPaymentDeadline(startOfDate, endOfDate, status);
    }

    public Invoice findInvoiceById(final String invoiceId) {
        Optional<Invoice> hadInvoice = retrieveInvoiceById(invoiceId);
        if (!hadInvoice.isPresent()) {
            throw new ResourceNotFoundException("The invoice by " + invoiceId + " not found.");
        }
        return hadInvoice.get();
    }

    public Invoice findLastedInvoiceByApartment(final String apartmentId) {
        Optional<Invoice> hadInvoice = retrieveInvoiceByApartmentId(apartmentId);
        if (!hadInvoice.isPresent()) {
            throw new ResourceNotFoundException("The invoice by " + apartmentId + " not found.");
        }
        return hadInvoice.get();
    }

    public Optional<Invoice> retrieveInvoiceById(final String invoiceId) {
        return invoiceRepo.findByInvoiceId(invoiceId);
    }

    public Optional<Invoice> retrieveInvoiceByApartmentId(final String apartmentId) {
        return invoiceRepo.findByApartmentId(apartmentId);
    }

    public Page<Invoice> findMatchingInvoices(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return invoiceRepo.findAll(newSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }
}
