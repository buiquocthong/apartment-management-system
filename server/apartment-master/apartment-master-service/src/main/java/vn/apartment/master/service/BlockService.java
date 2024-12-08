package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.exception.ResourceAlreadyExistedException;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.master.dao.BlockRepo;
import vn.apartment.master.entity.apartment.Block;

import java.util.List;
import java.util.Optional;

@Service
public class BlockService {

    private static final Logger LOG = LoggerFactory.getLogger(BlockService.class);

    @Autowired
    private BlockRepo blockRepo;

    public List<Block> findAll() {
        return blockRepo.findAll();
    }

    public Block saveOrUpdate(Block block) {
        return blockRepo.save(block);
    }

    public Block findBlockById(final String blockId){
        Optional<Block> hadBlock = retrieveBlockById(blockId);
        if (!hadBlock.isPresent()) {
            throw new ResourceNotFoundException("The block by " + blockId + " not found.");
        }
        return hadBlock.get();
    }

    public Block findBlockByApartment(final String apartmentId) {
        Optional<Block> hadBlock = retrieveBlockByApartmentId(apartmentId);
        if (!hadBlock.isPresent()) {
            throw new ResourceNotFoundException("The block by " + apartmentId + " not found.");
        }
        return hadBlock.get();
    }

    public Block findBlockByFloor(final String floorId) {
        Optional<Block> hadBlock = retrieveBlockByFloorId(floorId);
        if (!hadBlock.isPresent()) {
            throw new ResourceNotFoundException("The block by " + floorId + " not found.");
        }
        return hadBlock.get();
    }

    public Optional<Block> retrieveBlockById(final String blockId) {
        return blockRepo.findByBlockId(blockId);
    }

    public Optional<Block> retrieveBlockByName(final String name) {
        return blockRepo.findByName(name);
    }

    public Optional<Block> retrieveBlockByApartmentId(final String apartmentId) {
        return blockRepo.findByApartmentId(apartmentId);
    }

    public Optional<Block> retrieveBlockByFloorId(final String floorId) {
        return blockRepo.findByFloorId(floorId);
    }

    public void checkExistBlockByName(String name) {
        Optional<Block> hadBlock = retrieveBlockByName(name);
        if (hadBlock.isPresent()) {
            throw new ResourceAlreadyExistedException("The block by " + name + " already existed.");
        }
    }
}
