package vn.apartment.master.interactor.invoice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.invoice.InvoiceDTO;
import vn.apartment.master.dto.invoice.InvoicePageDTO;
import vn.apartment.master.entity.record.Invoice;
import vn.apartment.master.mapper.InvoiceMapper;
import vn.apartment.master.service.InvoiceService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListInvoice {

    @Autowired
    private InvoiceService invoiceService;

    @Autowired
    private InvoiceMapper invoiceMapper;

    @Transactional
    public InvoicePageDTO execute(ApiQuery query) {
        Page<Invoice> pageResult = invoiceService.findMatchingInvoices(query);
        List<InvoiceDTO> dtos = pageResult.get()
                .map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
        return new InvoicePageDTO(pageResult.getTotalElements(), dtos);
    }
}
