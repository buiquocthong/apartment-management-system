package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.invoice.AddInvoiceDTO;
import vn.apartment.master.dto.invoice.InvoiceDTO;
import vn.apartment.master.dto.invoice.UpdateInvoiceDTO;
import vn.apartment.master.entity.record.Invoice;

@Mapper(componentModel = "spring", uses = {ApartmentMapper.class})
public interface InvoiceMapper {
    InvoiceDTO toDTO(Invoice invoice);
    Invoice toEntity(AddInvoiceDTO invoiceDTO);
    void updateEntity(UpdateInvoiceDTO invoiceDTO, @MappingTarget Invoice invoice);
}
