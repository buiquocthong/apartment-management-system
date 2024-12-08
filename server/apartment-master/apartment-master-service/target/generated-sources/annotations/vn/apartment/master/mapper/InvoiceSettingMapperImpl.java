package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.invoicesetting.InvoiceSettingDTO;
import vn.apartment.master.dto.invoicesetting.UpdateInvoiceSettingDTO;
import vn.apartment.master.entity.setting.InvoiceSetting;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class InvoiceSettingMapperImpl implements InvoiceSettingMapper {

    @Override
    public InvoiceSettingDTO toDTO(InvoiceSetting invoiceSetting) {
        if ( invoiceSetting == null ) {
            return null;
        }

        InvoiceSettingDTO invoiceSettingDTO = new InvoiceSettingDTO();

        invoiceSettingDTO.setCreateDate( invoiceSetting.getCreateDate() );
        invoiceSettingDTO.setInvoiceSettingId( invoiceSetting.getInvoiceSettingId() );
        invoiceSettingDTO.setMaxExpiredTime( invoiceSetting.getMaxExpiredTime() );
        invoiceSettingDTO.setPenaltyFeePercentage( invoiceSetting.getPenaltyFeePercentage() );
        invoiceSettingDTO.setUpdateDate( invoiceSetting.getUpdateDate() );

        return invoiceSettingDTO;
    }

    @Override
    public void update(UpdateInvoiceSettingDTO invoiceSettingDTO, InvoiceSetting invoiceSetting) {
        if ( invoiceSettingDTO == null ) {
            return;
        }

        invoiceSetting.setMaxExpiredTime( invoiceSettingDTO.getMaxExpiredTime() );
        invoiceSetting.setPenaltyFeePercentage( invoiceSettingDTO.getPenaltyFeePercentage() );
    }
}
