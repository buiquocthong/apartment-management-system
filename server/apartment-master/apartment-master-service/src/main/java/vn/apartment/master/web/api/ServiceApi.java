package vn.apartment.master.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.service.AddServiceDTO;
import vn.apartment.master.dto.service.ServiceDTO;
import vn.apartment.master.dto.service.UpdateServiceDTO;
import vn.apartment.master.interactor.service.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(MasterAPIs.SERVICE_API)
public class ServiceApi {

    @Autowired
    private AddService addService;
    @Autowired
    private UpdateService updateService;
    @Autowired
    private ListService listService;
    @Autowired
    private FindService findService;
    @Autowired
    private RemoveService removeService;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_SERVICE")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE','ADD/UPDATE')")
    public ResponseEntity<String> addService(@Valid @RequestBody AddServiceDTO serviceDTO) {
        if (serviceDTO == null) {
            throw new InvalidParameterException("Missing apartment request body");
        }
        addService.execute(serviceDTO);
        return new ResponseEntity<>("add service successfully", HttpStatus.CREATED);
    }

    @PutMapping("/{serviceId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_SERVICE")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE','ADD/UPDATE')")
    public ResponseEntity<String> updateService(@PathVariable String serviceId, @Valid @RequestBody UpdateServiceDTO serviceDTO) {
        serviceDTO.setServiceId(serviceId);
        updateService.execute(serviceDTO);
        return new ResponseEntity<>("update service successfully", HttpStatus.OK);
    }

    @GetMapping("/{serviceId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE','VIEW')")
    public ServiceDTO findService(@PathVariable(value = "serviceId") String serviceId) {
        return findService.execute(serviceId);
    }

    @GetMapping()
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE','VIEW')")
    public List<ServiceDTO> listServices() {
        return listService.execute();
    }

    @DeleteMapping("/{serviceId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('SERVICE','REMOVE')")
    public ResponseEntity<String> deleteService(@PathVariable(value = "serviceId") String serviceId) {
        removeService.execute(serviceId);
        return new ResponseEntity<>("delete service successfully", HttpStatus.OK);
    }
}
