package vn.apartment.master.interactor.invoice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.invoice.InvoiceStatus;
import vn.apartment.master.entity.record.Invoice;
import vn.apartment.master.service.InvoiceService;

@Interactor
public class CollectMoney {
    @Autowired
    private InvoiceService invoiceService;

    @Transactional
    public void execute(final String invoiceId) {
        Invoice hadInvoice = invoiceService.findInvoiceById(invoiceId);
        hadInvoice.setStatus(InvoiceStatus.PAID);
        invoiceService.saveOrUpdate(hadInvoice);
    }
}
