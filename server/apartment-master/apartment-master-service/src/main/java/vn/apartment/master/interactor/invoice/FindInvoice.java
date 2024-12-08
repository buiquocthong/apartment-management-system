package vn.apartment.master.interactor.invoice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.invoice.InvoiceDTO;
import vn.apartment.master.mapper.InvoiceMapper;
import vn.apartment.master.service.InvoiceService;

@Interactor
public class FindInvoice {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Transactional(readOnly = true)
    public InvoiceDTO execute(final String invoiceId) {
        return invoiceMapper.toDTO(invoiceService.findInvoiceById(invoiceId));
    }
}
