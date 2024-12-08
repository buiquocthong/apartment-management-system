package vn.apartment.master.interactor.invoicesetting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.invoicesetting.InvoiceSettingDTO;
import vn.apartment.master.mapper.InvoiceSettingMapper;
import vn.apartment.master.service.InvoiceSettingService;

@Interactor
public class FindInvoiceSetting {

    @Autowired
    private InvoiceSettingService invoiceSettingService;
    @Autowired
    private InvoiceSettingMapper invoiceSettingMapper;

    @Transactional(readOnly = true)
    public InvoiceSettingDTO execute(){
        return invoiceSettingMapper.toDTO(invoiceSettingService.getInvoiceSetting());
    }
}
