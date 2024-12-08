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
import vn.apartment.master.dto.renter.AddRenterDTO;
import vn.apartment.master.dto.renter.RenterDTO;
import vn.apartment.master.dto.renter.RenterPageDTO;
import vn.apartment.master.dto.renter.UpdateRenterDTO;
import vn.apartment.master.interactor.renter.*;

import javax.validation.Valid;

@RestController
@RequestMapping(MasterAPIs.RENTER_API)
public class RenterApi {
    @Autowired
    private AddRenter addRenter;
    @Autowired
    private FindRenter findRenter;
    @Autowired
    private ListRenter listRenter;
    @Autowired
    private UpdateRenter updateRenter;
    @Autowired
    private RemoveRenter removeRenter;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_RENTER")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RENTER','ADD/UPDATE')")
    public ResponseEntity<String> addRenter(@Valid @RequestBody AddRenterDTO renterDTO) {
        if (renterDTO == null) {
            throw new InvalidParameterException("Missing renter request body");
        }
        addRenter.execute(renterDTO);
        return new ResponseEntity<>("add renter successfully",HttpStatus.CREATED);
    }

    @PutMapping("/{renterId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_RENTER")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RENTER','ADD/UPDATE')")
    public ResponseEntity<String> updateRenter(@PathVariable(value = "renterId") String renterId, @Valid @RequestBody UpdateRenterDTO renterDTO) {
        renterDTO.setRenterId(renterId);
        updateRenter.execute(renterDTO);
        return new ResponseEntity<>("update renter successfully",HttpStatus.OK);
    }

    @GetMapping(value = "/{renterId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RENTER','VIEW')")
    public RenterDTO findRenter(@PathVariable(value = "renterId") String renterId ) {
        return findRenter.execute(renterId);
    }

    @ApiQueryParams
    @GetMapping
    @PreAuthorize("@permissionSecurity.hasPrivileges('RENTER','VIEW')")
    public RenterPageDTO listRenters(@Parameter(hidden = true) @ModelAttribute ApiQuery query){
        return listRenter.execute(query);
    }

    @DeleteMapping("/{renterId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RENTER','REMOVE')")
    public ResponseEntity<String> removeRenter(@PathVariable(value = "renterId") String renterId) {
        removeRenter.execute(renterId);
        return new ResponseEntity<>("delete renter successfully",HttpStatus.OK);
    }
}
