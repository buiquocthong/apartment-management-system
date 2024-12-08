package vn.apartment.master.interactor.invoice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.invoice.UpdateInvoiceDTO;
import vn.apartment.master.entity.record.Invoice;
import vn.apartment.master.mapper.InvoiceMapper;
import vn.apartment.master.service.InvoiceService;

@Interactor
public class UpdateInvoice {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Transactional
    public void execute(final UpdateInvoiceDTO invoiceDTO) {
        Invoice hadInvoice = invoiceService.findInvoiceById(invoiceDTO.getInvoiceId());
        invoiceMapper.updateEntity(invoiceDTO, hadInvoice);
        invoiceService.saveOrUpdate(hadInvoice);
    }
}
