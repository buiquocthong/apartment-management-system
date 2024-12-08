package vn.apartment.master.web.api;

import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.ApiQueryParams;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.invoice.AddInvoiceDTO;
import vn.apartment.master.dto.invoice.InvoiceDTO;
import vn.apartment.master.dto.invoice.InvoicePageDTO;
import vn.apartment.master.dto.invoice.UpdateInvoiceDTO;
import vn.apartment.master.interactor.invoice.*;

import javax.validation.Valid;

@RestController
@RequestMapping(MasterAPIs.INVOICE_API)
public class InvoiceApi {

    @Autowired
    private AddInvoice addInvoice;
    @Autowired
    private FindInvoice findInvoice;
    @Autowired
    private ListInvoice listInvoice;
    @Autowired
    private UpdateInvoice updateInvoice;
    @Autowired
    private RemoveInvoice removeInvoice;
    @Autowired
    private CollectMoney collectMoney;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_INVOICE")
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','ADD/UPDATE')")
    public ResponseEntity<String> addInvoice(@Valid @RequestBody AddInvoiceDTO addInvoiceDTO) {
        if (addInvoiceDTO == null) {
            throw new InvalidParameterException("Missing apartment request body");
        }
        addInvoice.execute(addInvoiceDTO);
        return new ResponseEntity<>("add invoice successfully", HttpStatus.CREATED);
    }

    @PutMapping("/{invoiceId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_INVOICE")
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','ADD/UPDATE')")
    public ResponseEntity<String> updateInvoice(@PathVariable(name = "invoiceId") String invoiceId, @Valid @RequestBody UpdateInvoiceDTO updateInvoiceDTO) {
        updateInvoiceDTO.setInvoiceId(invoiceId);
        updateInvoice.execute(updateInvoiceDTO);
        return new ResponseEntity<>("update invoice successfully", HttpStatus.OK);
    }

    @GetMapping("/{invoiceId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','VIEW')")
    public InvoiceDTO findInvoice(@PathVariable(name = "invoiceId") String invoiceId) {
        return findInvoice.execute(invoiceId);
    }

    @ApiQueryParams
    @GetMapping
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','VIEW')")
    public InvoicePageDTO listInvoices(@Parameter(hidden = true) @ModelAttribute ApiQuery query){
        return listInvoice.execute(query);
    }

    @DeleteMapping("/{invoiceId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','REMOVE')")
    public ResponseEntity<String> removeInvoice(@PathVariable(name = "invoiceId") String invoiceId) {
        removeInvoice.execute(invoiceId);
        return new ResponseEntity<>("remove invoice successfully", HttpStatus.OK);
    }

    @PutMapping("/approved/{invoiceId}")
    //@PreAuthorize("@permissionSecurity.hasPrivileges('INVOICE','ADD/UPDATE')")
    public ResponseEntity<String> completeInvoice(@PathVariable(name = "invoiceId") String invoiceId){
        collectMoney.execute(invoiceId);
        return new ResponseEntity<>("complete invoice successfully", HttpStatus.OK);
    }
}
