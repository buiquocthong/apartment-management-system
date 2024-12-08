package vn.apartment.master.interactor.invoice;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.invoice.InvoiceDTO;
import vn.apartment.master.mapper.InvoiceMapper;
import vn.apartment.master.service.InvoiceService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListHistoryInvoiceByApartment {
    @Autowired
    private InvoiceService invoiceService;
    @Autowired
    private InvoiceMapper invoiceMapper;

    @Transactional(readOnly = true)
    public List<InvoiceDTO> execute(final String apartmentId) {
        return invoiceService.getOldInvoiceByApartment(apartmentId)
                .stream().map(invoiceMapper::toDTO)
                .collect(Collectors.toList());
    }
}
