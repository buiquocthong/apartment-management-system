package vn.apartment.master.interactor.invoicesetting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.invoicesetting.UpdateInvoiceSettingDTO;
import vn.apartment.master.entity.setting.InvoiceSetting;
import vn.apartment.master.mapper.InvoiceSettingMapper;
import vn.apartment.master.service.InvoiceSettingService;

@Interactor
public class UpdateInvoiceSetting {
    @Autowired
    private InvoiceSettingService invoiceSettingService;
    @Autowired
    private InvoiceSettingMapper invoiceSettingMapper;

    @Transactional
    public void execute(UpdateInvoiceSettingDTO updateInvoiceSettingDTO) {
        InvoiceSetting hadInvoiceSetting = invoiceSettingService.getInvoiceSetting();
        invoiceSettingMapper.update(updateInvoiceSettingDTO, hadInvoiceSetting);
        invoiceSettingService.saveOrUpdate(hadInvoiceSetting);
    }
}
