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
import vn.apartment.master.dto.contract.AddContractDTO;
import vn.apartment.master.dto.contract.ContractDTO;
import vn.apartment.master.dto.contract.ContractPageDTO;
import vn.apartment.master.interactor.contract.AddContract;
import vn.apartment.master.interactor.contract.FindContract;
import vn.apartment.master.interactor.contract.ListContract;
import vn.apartment.master.interactor.contract.RemoveContract;

import javax.validation.Valid;

@RestController
@RequestMapping(MasterAPIs.CONTRACT_API)
public class ContractApi {
    @Autowired
    private AddContract addContract;
    @Autowired
    private FindContract findContract;
    @Autowired
    private ListContract listContract;
    @Autowired
    private RemoveContract removeContract;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_CONTRACT")
    @PreAuthorize("@permissionSecurity.hasPrivileges('CONTRACT','ADD/UPDATE')")
    public ResponseEntity<String> addContract(@Valid @RequestBody final AddContractDTO addContractDTO) {
        if (addContractDTO == null) {
            throw new InvalidParameterException("Missing apartment request body");
        }
        addContract.execute(addContractDTO);
        return new ResponseEntity<>("add contract successfully", HttpStatus.CREATED);
    }

    @GetMapping(value = "/{contractId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('CONTRACT','VIEW')")
    public ContractDTO findContract(@PathVariable("contractId") final String contractId) {
        return findContract.execute(contractId);
    }

    @ApiQueryParams
    @GetMapping()
    @PreAuthorize("@permissionSecurity.hasPrivileges('CONTRACT','VIEW')")
    public ContractPageDTO listContracts(@Parameter(hidden = true) @ModelAttribute ApiQuery query){
        return listContract.execute(query);
    }

    @DeleteMapping("/{contractId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('CONTRACT','REMOVE')")
    public ResponseEntity<String> removeContract(@PathVariable("contractId") final String contractId){
        removeContract.execute(contractId);
        return new ResponseEntity<>("remove contract successfully", HttpStatus.OK);
    }
}
