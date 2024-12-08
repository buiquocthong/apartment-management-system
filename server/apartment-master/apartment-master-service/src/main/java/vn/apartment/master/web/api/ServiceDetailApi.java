package vn.apartment.master.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.servicedetail.AddServiceDetailDTO;
import vn.apartment.master.dto.servicedetail.UpdateServiceDetailDTO;
import vn.apartment.master.interactor.servicedetail.AddServiceDetail;
import vn.apartment.master.interactor.servicedetail.RemoveServiceDetail;
import vn.apartment.master.interactor.servicedetail.UpdateServiceDetail;

import javax.validation.Valid;

@RestController
@RequestMapping(MasterAPIs.SERVICE_DETAIL_API)
public class ServiceDetailApi {

    @Autowired
    private AddServiceDetail addServiceDetail;
    @Autowired
    private UpdateServiceDetail updateServiceDetail;
    @Autowired
    private RemoveServiceDetail removeServiceDetail;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_SERVICE_DETAIL")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE_DETAIL','ADD/UPDATE')")
    public ResponseEntity<String> addServiceDetail(@Valid @RequestBody AddServiceDetailDTO serviceDetailDTO) {
        if (serviceDetailDTO == null) {
            throw new InvalidParameterException("Missing service detail request body");
        }
        addServiceDetail.execute(serviceDetailDTO);
        return new ResponseEntity<>("add service detail successfully", HttpStatus.CREATED);
    }

    @PutMapping("/{serviceDetailId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_SERVICE_DETAIL")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE_DETAIL','ADD/UPDATE')")
    public ResponseEntity<String> updateServiceDetail(@PathVariable(value = "serviceDetailId") String serviceDetailId,@Valid @RequestBody UpdateServiceDetailDTO serviceDetailDTO){
        serviceDetailDTO.setServiceDetailId(serviceDetailId);
        updateServiceDetail.execute(serviceDetailDTO);
        return new ResponseEntity<>("update service detail successfully ", HttpStatus.OK);
    }
    @DeleteMapping("/{serviceDetailId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE_DETAIL','REMOVE')")
    public ResponseEntity<String> removeServiceDetail(@PathVariable(value = "serviceDetailId") String serviceDetailId) {
        removeServiceDetail.execute(serviceDetailId);
        return new ResponseEntity<>("remove service detail successfully ", HttpStatus.OK);
    }
}
