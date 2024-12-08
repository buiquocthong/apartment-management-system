package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.master.dao.FloorRepo;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.entity.apartment.Floor;

import java.util.List;
import java.util.Optional;

@Service
public class FloorService {

    private static final Logger LOG = LoggerFactory.getLogger(FloorService.class);

    @Autowired
    private FloorRepo floorRepo;
    @Autowired
    private BlockService blockService;

    public Floor saveOrUpdate(Floor floor) {
        return floorRepo.save(floor);
    }

    public Floor findFloorById(final String floorId){
        Optional<Floor> hadFloor = floorRepo.findByFloorId(floorId);
        if (!hadFloor.isPresent()) {
            throw new ResourceNotFoundException("The floor by " + floorId + " not found.");
        }
        return hadFloor.get();
    }

    public List<Floor> getFloorByBlock(final String blockId){
        Block hadBlock = blockService.findBlockById(blockId);
        return retrieveFloorsByBlockId(hadBlock.getBlockId());
    }

    public List<Floor> retrieveFloorsByBlockId(final String blockId) {
        return floorRepo.findByBlockId(blockId);
    }

    public Optional<Floor> retrieveFloorById(final String floorId) {
        return floorRepo.findByFloorId(floorId);
    }
}
