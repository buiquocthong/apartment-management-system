package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.invoicesetting.InvoiceSettingDTO;
import vn.apartment.master.dto.invoicesetting.UpdateInvoiceSettingDTO;
import vn.apartment.master.entity.setting.InvoiceSetting;

@Mapper(componentModel = "spring")
public interface InvoiceSettingMapper {
    InvoiceSettingDTO toDTO(InvoiceSetting invoiceSetting);
    void update(UpdateInvoiceSettingDTO invoiceSettingDTO, @MappingTarget InvoiceSetting invoiceSetting);
}
