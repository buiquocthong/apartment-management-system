package vn.apartment.master.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.invoicesetting.InvoiceSettingDTO;
import vn.apartment.master.dto.invoicesetting.UpdateInvoiceSettingDTO;
import vn.apartment.master.interactor.invoicesetting.FindInvoiceSetting;
import vn.apartment.master.interactor.invoicesetting.UpdateInvoiceSetting;

import javax.validation.Valid;

@RestController
@RequestMapping(MasterAPIs.INVOICE_SETTING_API)
public class InvoiceSettingApi {

    @Autowired
    private FindInvoiceSetting findInvoiceSetting;
    @Autowired
    private UpdateInvoiceSetting updateInvoiceSetting;

    @GetMapping
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','VIEW')")
    public InvoiceSettingDTO findInvoiceSetting() {
        return findInvoiceSetting.execute();
    }

    @PutMapping
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_INVOICE_SETTING")
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','ADD/UPDATE')")
    public ResponseEntity<String> updateInvoiceSetting(@Valid @RequestBody UpdateInvoiceSettingDTO updateInvoiceSettingDTO) {
        updateInvoiceSetting.execute(updateInvoiceSettingDTO);
        return new ResponseEntity<>("update invoice setting successfully", HttpStatus.OK);
    }
}
