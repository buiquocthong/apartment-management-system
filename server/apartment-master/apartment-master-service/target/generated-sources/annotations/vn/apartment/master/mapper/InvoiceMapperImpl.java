package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.invoice.AddInvoiceDTO;
import vn.apartment.master.dto.invoice.InvoiceDTO;
import vn.apartment.master.dto.invoice.UpdateInvoiceDTO;
import vn.apartment.master.entity.record.Invoice;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class InvoiceMapperImpl implements InvoiceMapper {

    @Autowired
    private ApartmentMapper apartmentMapper;

    @Override
    public InvoiceDTO toDTO(Invoice invoice) {
        if ( invoice == null ) {
            return null;
        }

        InvoiceDTO invoiceDTO = new InvoiceDTO();

        invoiceDTO.setApartment( apartmentMapper.toDTO( invoice.getApartment() ) );
        invoiceDTO.setCreateDate( invoice.getCreateDate() );
        invoiceDTO.setExtraPaymentDeadline( invoice.getExtraPaymentDeadline() );
        invoiceDTO.setInvoiceId( invoice.getInvoiceId() );
        invoiceDTO.setPaymentDeadline( invoice.getPaymentDeadline() );
        invoiceDTO.setPenaltyFee( invoice.getPenaltyFee() );
        invoiceDTO.setStatus( invoice.getStatus() );
        invoiceDTO.setTotal( invoice.getTotal() );
        invoiceDTO.setUpdateDate( invoice.getUpdateDate() );

        return invoiceDTO;
    }

    @Override
    public Invoice toEntity(AddInvoiceDTO invoiceDTO) {
        if ( invoiceDTO == null ) {
            return null;
        }

        Invoice invoice = new Invoice();

        invoice.setPaymentDeadline( invoiceDTO.getPaymentDeadline() );
        invoice.setStatus( invoiceDTO.getStatus() );

        return invoice;
    }

    @Override
    public void updateEntity(UpdateInvoiceDTO invoiceDTO, Invoice invoice) {
        if ( invoiceDTO == null ) {
            return;
        }

        invoice.setInvoiceId( invoiceDTO.getInvoiceId() );
        invoice.setPaymentDeadline( invoiceDTO.getPaymentDeadline() );
        invoice.setStatus( invoiceDTO.getStatus() );
    }
}
