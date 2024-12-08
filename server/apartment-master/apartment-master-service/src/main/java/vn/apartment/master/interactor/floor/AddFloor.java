package vn.apartment.master.interactor.floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.floor.AddFloorDTO;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.entity.apartment.Floor;
import vn.apartment.master.mapper.FloorMapper;
import vn.apartment.master.service.BlockService;
import vn.apartment.master.service.FloorService;

@Interactor
public class AddFloor {

    @Autowired
    private FloorService floorService;
    @Autowired
    private FloorMapper floorMapper;
    @Autowired
    private BlockService blockService;

    public void execute(AddFloorDTO floor) {
        if (floor == null) {
            throw new InvalidParameterException("The request body is missing.");
        }
        saveNewFloor(floor);
    }
    @Transactional
    public Floor saveNewFloor(AddFloorDTO floor) {
        Block hadBlock = blockService.findBlockById(floor.getBlockId());
        hadBlock.setTotalFloor(hadBlock.getTotalFloor() + 1);
        blockService.saveOrUpdate(hadBlock);
        Floor newFloor = floorMapper.toEntity(floor);
        newFloor.setFloorId(Generators.uuid());
        newFloor.setBlock(hadBlock);
        return floorService.saveOrUpdate(newFloor);
    }
}
