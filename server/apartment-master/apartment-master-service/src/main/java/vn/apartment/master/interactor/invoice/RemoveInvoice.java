package vn.apartment.master.interactor.invoice;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.service.InvoiceService;

@Interactor
public class RemoveInvoice {
    @Autowired
    private InvoiceService invoiceService;

    @Transactional
    public void execute(final String invoiceId) {
        if (ObjectUtils.isEmpty(invoiceId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        invoiceService.delete(invoiceId);
    }
}
