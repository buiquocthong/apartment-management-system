package vn.apartment.master.interactor.floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.floor.UpdateFloorDTO;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.entity.apartment.Floor;
import vn.apartment.master.mapper.FloorMapper;
import vn.apartment.master.service.BlockService;
import vn.apartment.master.service.FloorService;

@Interactor
public class UpdateFloor {
    @Autowired
    private FloorService floorService;
    @Autowired
    private FloorMapper floorMapper;
    @Autowired
    private BlockService blockService;

    @Transactional
    public void execute(UpdateFloorDTO floor){
        Floor hadFloor = floorService.findFloorById(floor.getFloorId());
        Block hadBlock = blockService.findBlockById(floor.getBlockId());
        floorMapper.updateEntity(floor, hadFloor);
        floorService.saveOrUpdate(hadFloor);
    }
}
