package vn.apartment.master.web.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.master.dto.block.AddBlockDTO;
import vn.apartment.master.dto.block.BlockDTO;
import vn.apartment.master.dto.block.UpdateBlockDTO;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.floor.FloorDTO;
import vn.apartment.master.interactor.block.AddBlock;
import vn.apartment.master.interactor.block.FindBlock;
import vn.apartment.master.interactor.block.ListBlock;
import vn.apartment.master.interactor.block.UpdateBlock;
import vn.apartment.master.interactor.floor.ListFloorByBlock;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping(MasterAPIs.BLOCK_API)
public class BlockApi {

    @Autowired
    private AddBlock addBlock;
    @Autowired
    private FindBlock findBlock;
    @Autowired
    private UpdateBlock updateBlock;
    @Autowired
    private ListBlock listBlock;
    @Autowired
    private ListFloorByBlock listFloorByBlock;

    @PostMapping()
    @ResponseStatus(HttpStatus.CREATED)
    @AuditAction("ADD_BLOCK")
    @PreAuthorize("@permissionSecurity.hasPrivileges('BLOCK','ADD/UPDATE')")
    public ResponseEntity<String> addBlock(@Valid @RequestBody final AddBlockDTO blockDTO) {
        if (blockDTO == null) {
            throw new InvalidParameterException("Missing apartment request body");
        }
        addBlock.execute(blockDTO);
        return new ResponseEntity<>("add block successfully",HttpStatus.CREATED);
    }

    @PutMapping(value = "/{blockId}")
    @ResponseStatus(HttpStatus.OK)
    @AuditAction("UPDATE_BLOCK")
    @PreAuthorize("@permissionSecurity.hasPrivileges('BLOCK','ADD/UPDATE')")
    public ResponseEntity<String> updateBlock(@PathVariable("blockId") String blockId, @RequestBody UpdateBlockDTO blockDTO) {
        blockDTO.setBlockId(blockId);
        updateBlock.execute(blockDTO);
        return new ResponseEntity<>("update block successfully",HttpStatus.OK);
    }

    @GetMapping(value = "/{blockId}")
    @PreAuthorize("@permissionSecurity.hasPrivileges('BLOCK','VIEW')")
    public BlockDTO findBlock(@PathVariable(value = "blockId") String blockId) {
        return findBlock.execute(blockId);
    }

    @GetMapping()
    @PreAuthorize("@permissionSecurity.hasPrivileges('BLOCK','VIEW')")
    public List<BlockDTO> listBlocks() {
        return listBlock.execute();
    }

    @GetMapping("/{blockId}/floors")
    @PreAuthorize("@permissionSecurity.hasPrivileges('FLOOR','VIEW')")
    public List<FloorDTO> listFloorsByBlock(@PathVariable String blockId){
        return listFloorByBlock.execute(blockId);
    }
}
