package vn.apartment.master.web.api;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Schema;
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
import vn.apartment.master.dto.owner.*;
import vn.apartment.master.interactor.owner.*;

import javax.validation.Valid;

@RestController
@RequestMapping(MasterAPIs.OWNER_API)
public class OwnerApi {

    @Autowired
    private AddOwner addOwner;
    @Autowired
    private UpdateOwner updateOwner;
    @Autowired
    private FindOwner findOwner;
    @Autowired
    private ListOwner listOwner;
    @Autowired
    private RemoveOwner removeOwner;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_OWNER")
    @PreAuthorize("@permissionSecurity.hasPrivileges('OWNER','ADD/UPDATE')")
    public ResponseEntity<String> addOwner(@Valid @RequestBody AddMemberDTO residentDTO) {
        if (residentDTO == null) {
            throw new InvalidParameterException("Missing owner request body");
        }
        addOwner.execute(residentDTO);
        return new ResponseEntity<>("add owner successfully",HttpStatus.CREATED);
    }

    @PutMapping("/{ownerId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_OWNER")
    @PreAuthorize("@permissionSecurity.hasPrivileges('OWNER','ADD/UPDATE')")
    public ResponseEntity<String> updateOwner(@PathVariable String ownerId, @Valid @RequestBody UpdateOwnerDTO residentDTO) {
        residentDTO.setOwnerId(ownerId);
        updateOwner.execute(residentDTO);
        return new ResponseEntity<>("update owner successfully",HttpStatus.OK);
    }

    @GetMapping(value = "/{ownerId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('OWNER','VIEW')")
    public OwnerDTO findOwner(@PathVariable(value = "ownerId") String ownerId ) {
        return findOwner.execute(ownerId);
    }

    @Parameters(
            @Parameter(name = "sort_by", in = ParameterIn.QUERY,
                    schema = @Schema(type = "string", allowableValues = {"update_date"}, defaultValue = "update_date")
            )
    )
    @ApiQueryParams
    @GetMapping
    @PreAuthorize("@permissionSecurity.hasPrivileges('OWNER','VIEW')")
    public OwnerPageDTO listOwners(@Parameter(hidden = true) @ModelAttribute ApiQuery query){
        return listOwner.execute(query);
    }

    @DeleteMapping("/{ownerId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('OWNER','REMOVE')")
    public ResponseEntity<String> removeOwner(@PathVariable(value = "ownerId") String ownerId) {
        removeOwner.execute(ownerId);
        return new ResponseEntity<>("delete owner successfully",HttpStatus.OK);
    }
}
