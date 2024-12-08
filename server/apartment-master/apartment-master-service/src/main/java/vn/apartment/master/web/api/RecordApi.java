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
import vn.apartment.master.dto.record.AddRecordDTO;
import vn.apartment.master.dto.record.RecordDTO;
import vn.apartment.master.dto.record.RecordPageDTO;
import vn.apartment.master.dto.record.UpdateRecordDTO;
import vn.apartment.master.interactor.record.*;

import javax.validation.Valid;

@RestController
@RequestMapping(MasterAPIs.RECORD_API)
public class RecordApi {
    @Autowired
    private AddRecord addRecord;
    @Autowired
    private UpdateRecord updateRecord;
    @Autowired
    private FindRecord findRecord;
    @Autowired
    private ListRecord listRecord;
    @Autowired
    private RemoveRecord removeRecord;
    @Autowired
    private ListExpiredRecord listExpiredRecord;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_RECORD")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RECORD','ADD/UPDATE')")
    public ResponseEntity<String> addRecord(@Valid @RequestBody AddRecordDTO recordDTO) {
        if (recordDTO == null) {
            throw new InvalidParameterException("Missing record request body");
        }
        addRecord.execute(recordDTO);
        return new ResponseEntity<>("add record successfully",HttpStatus.CREATED);
    }

    @PutMapping("/{recordId}")
    @AuditAction("UPDATE_RECORD")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RECORD','ADD/UPDATE')")
    public ResponseEntity<String> updateRecord(@PathVariable String recordId, @Valid @RequestBody UpdateRecordDTO recordDTO) {
        recordDTO.setRecordId(recordId);
        updateRecord.execute(recordDTO);
        return new ResponseEntity<>("update record successfully",HttpStatus.OK);
    }

    @GetMapping(value = "/{recordId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RECORD','VIEW')")
    public RecordDTO findRecord(@PathVariable(value = "recordId") String recordId ) {
        return findRecord.execute(recordId);
    }

    @ApiQueryParams
    @GetMapping
    @PreAuthorize("@permissionSecurity.hasPrivileges('RECORD','VIEW')")
    public RecordPageDTO listRecords(@Parameter(hidden = true) @ModelAttribute ApiQuery query){
        return listRecord.execute(query);
    }

    @ApiQueryParams
    @GetMapping("/expired")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RECORD','VIEW')")
    public RecordPageDTO listExpiredRecords(@Parameter(hidden = true) @ModelAttribute ApiQuery query){
        return listExpiredRecord.execute(query);
    }

    @DeleteMapping("/{recordId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('RECORD','REMOVE')")
    public ResponseEntity<String> removeRecord(@PathVariable(value = "recordId") String recordId) {
        removeRecord.execute(recordId);
        return new ResponseEntity<>("delete record successfully",HttpStatus.OK);
    }
}
