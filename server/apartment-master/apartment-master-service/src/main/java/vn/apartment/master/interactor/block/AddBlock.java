package vn.apartment.master.interactor.block;

import org.springframework.beans.factory.annotation.Autowired;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.dto.block.AddBlockDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.entity.apartment.Floor;
import vn.apartment.master.mapper.BlockMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.BlockService;
import vn.apartment.master.service.FloorService;

import javax.transaction.Transactional;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Interactor
public class AddBlock {
    @Autowired
    private BlockService blockService;
    @Autowired
    private BlockMapper blockMapper;
    @Autowired
    private FloorService floorService;
    @Autowired
    private ApartmentService apartmentService;

    public void execute(AddBlockDTO blockDTO) {

        if (blockDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }

        blockService.checkExistBlockByName(blockDTO.getName());

        Block newBlock = saveNewBlock(blockDTO);

    }

    @Transactional
    public Block saveNewBlock(AddBlockDTO block) {

        if (block.getTotalFloor() <= 0 || block.getApartmentsPerFloor() <= 0) {
            throw new IllegalArgumentException("Total floors and apartments per floor must be positive numbers");
        }

        if (block.getName() == null || block.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Block name cannot be empty");
        }

        String blockName = block.getName().trim().toUpperCase();
        if (!blockName.matches("^[A-Z]$")) {
            throw new IllegalArgumentException("Block name must be a single letter (A-Z)");
        }

        Block newBlock = blockMapper.toEntity(block);
        newBlock.setBlockId(Generators.uuid());
        newBlock.setTotalFloor(block.getTotalFloor());
        newBlock.setTotalApartment(block.getTotalFloor() * block.getApartmentsPerFloor());
        blockService.saveOrUpdate(newBlock);

        for (int floorNumber = 1; floorNumber <= block.getTotalFloor(); floorNumber++) {

            Floor floor = createFloor(floorNumber, newBlock);
            Floor savedFloor = floorService.saveOrUpdate(floor);

            List<Apartment> apartments = new ArrayList<>();
            for (int apartmentNumber = 1; apartmentNumber <= block.getApartmentsPerFloor(); apartmentNumber++) {
                Apartment apartment = createApartment(blockName, floorNumber, apartmentNumber, savedFloor, block.getArea(),
                        block.getFurnished(), block.getNumberOfBedroom(), block.getNumberOfBathroom(), block.getPurchasePrice());
                apartments.add(apartment);
            }
            apartmentService.saveAll(apartments);
        }

        return blockService.saveOrUpdate(newBlock);
    }

    private String generateApartmentId(String blockId, int floorNumber, int apartmentNumber) {
        return String.format("%s%d-0%02d", blockId, floorNumber, apartmentNumber);
    }

    private Floor createFloor(int floorNumber, Block block) {
        Floor floor = new Floor();
        floor.setFloorNumber(floorNumber);
        floor.setBlock(block);
        floor.setFloorId(Generators.uuid());
        return floor;
    }

    private Apartment createApartment(String blockName, int floorNumber, int apartmentNumber, Floor floor, double area,
                                      Boolean isFurnished, int numOfBedroom, int numOfBathroom, BigDecimal purchasePrice) {
        Apartment apartment = new Apartment();
        Apartment.SaleInfo saleInfo = new Apartment.SaleInfo();
        saleInfo.setPurchasePrice(purchasePrice);
        apartment.setName(generateApartmentId(blockName, floorNumber, apartmentNumber));
        apartment.setFloor(floor);
        apartment.setApartmentId(Generators.uuid());
        apartment.setStatus(ApartmentStatus.AVAILABLE);
        apartment.setSaleInfo(saleInfo);
        apartment.setArea(area);
        apartment.setNumberOfBathroom(numOfBathroom);
        apartment.setNumberOfBedroom(numOfBedroom);
        apartment.setFurnished(isFurnished);
        return apartment;
    }
}
