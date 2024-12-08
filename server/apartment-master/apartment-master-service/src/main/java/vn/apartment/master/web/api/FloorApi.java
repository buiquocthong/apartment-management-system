package vn.apartment.master.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.floor.AddFloorDTO;
import vn.apartment.master.dto.floor.FloorDTO;
import vn.apartment.master.dto.floor.UpdateFloorDTO;
import vn.apartment.master.interactor.apartment.ListApartmentsByFloor;
import vn.apartment.master.interactor.floor.AddFloor;
import vn.apartment.master.interactor.floor.FindFloor;
import vn.apartment.master.interactor.floor.UpdateFloor;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(MasterAPIs.FLOOR_API)
public class FloorApi {
    @Autowired
    private AddFloor addFloor;
    @Autowired
    private UpdateFloor updateFloor;
    @Autowired
    private FindFloor findFloor;
    @Autowired
    private ListApartmentsByFloor listApartmentsByFloor;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_FLOOR")
    @PreAuthorize("@permissionSecurity.hasPrivileges('FLOOR','ADD/UPDATE')")
    public ResponseEntity<String> addFloor(@Valid @RequestBody final AddFloorDTO addFloorDTO) {
        if (addFloorDTO == null) {
            throw new InvalidParameterException("Missing apartment request body");
        }
        addFloor.execute(addFloorDTO);
        return new ResponseEntity<>("add floor successfully", HttpStatus.CREATED);
    }

    @PutMapping(value = "/{floorId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_FLOOR")
    @PreAuthorize("@permissionSecurity.hasPrivileges('FLOOR','ADD/UPDATE')")
    public ResponseEntity<String> updateFloor(@PathVariable("floorId") String blockId, @RequestBody UpdateFloorDTO updateFloorDTO) {
        if (updateFloorDTO == null){
            throw new InvalidParameterException("Missing apartment request body");
        }
        updateFloor.execute(updateFloorDTO);
        return new ResponseEntity<>("update floor successfully", HttpStatus.OK);
    }

    @GetMapping("/{floorId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('FLOOR','VIEW')")
    public FloorDTO findFloor(@PathVariable("floorId") String floorId) {
        return findFloor.execute(floorId);
    }

    @GetMapping("/{floorId}/apartments")
    @PreAuthorize("@permissionSecurity.hasPrivileges('APARTMENT','VIEW')")
    public List<SimpleApartmentDTO> listApartmentsByFloor(@PathVariable String floorId){
        return listApartmentsByFloor.execute(floorId);
    }
}
