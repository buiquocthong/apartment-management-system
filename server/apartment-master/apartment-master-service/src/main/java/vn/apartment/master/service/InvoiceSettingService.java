package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.master.dao.InvoiceSettingRepo;
import vn.apartment.master.entity.setting.InvoiceSetting;

import java.util.Optional;

@Service
public class InvoiceSettingService {

    private static final Logger LOG = LoggerFactory.getLogger(InvoiceSettingService.class);

    private static final String INVOICE_SETTING_ID = "INVOICE_SETTING_ID";

    @Autowired
    private InvoiceSettingRepo invoiceSettingRepo;

    public InvoiceSetting saveOrUpdate(InvoiceSetting invoiceSetting) {
        return invoiceSettingRepo.save(invoiceSetting);
    }

    public InvoiceSetting getInvoiceSetting() {
        Optional<InvoiceSetting> hadInvoiceSetting = retrieveInvoiceSettingById(INVOICE_SETTING_ID);
        if (!hadInvoiceSetting.isPresent()) {
            throw new ResourceNotFoundException("The invoice setting by " + INVOICE_SETTING_ID + " not found.");
        }
        return hadInvoiceSetting.get();
    }

    public Optional<InvoiceSetting> retrieveInvoiceSettingById(String invoiceSettingId) {
        return invoiceSettingRepo.findByInvoiceSettingId(invoiceSettingId);
    }
}
