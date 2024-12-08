package vn.apartment.master.interactor.block;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.dto.block.BlockDTO;
import vn.apartment.master.dto.floor.FloorDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.entity.apartment.Floor;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.mapper.BlockMapper;
import vn.apartment.master.mapper.FloorMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.BlockService;
import vn.apartment.master.service.FloorService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class FindBlock {

    @Autowired
    private BlockService blockService;
    @Autowired
    private BlockMapper blockMapper;
    @Autowired
    private FloorService floorService;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private FloorMapper floorMapper;
    @Autowired
    private ApartmentMapper apartmentMapper;


    @Transactional(readOnly = true)
    public BlockDTO execute(String blockId) {
        if (ObjectUtils.isEmpty(blockId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }

        Block block = blockService.findBlockById(blockId);
        BlockDTO blockDTO = blockMapper.toDto(block);

        List<Floor> floors = floorService.getFloorByBlock(blockId);
        List<FloorDTO> floorDTOList = floors.stream()
                .map(floor -> {
                    FloorDTO floorDTO = floorMapper.toDTO(floor);

                    List<Apartment> apartments = apartmentService.getApartmentByFloor(floor.getFloorId());
                    List<SimpleApartmentDTO> apartmentDTOList = apartments.stream()
                            .map(apartmentMapper::toSimpleDTO)
                            .collect(Collectors.toList());

                    floorDTO.setApartments(apartmentDTOList);
                    return floorDTO;
                })
                .collect(Collectors.toList());

        blockDTO.setFloor(floorDTOList);

        blockDTO.setTotalFloor(floorDTOList.size());
        blockDTO.setTotalApartment(floorDTOList.stream()
                .mapToInt(f -> f.getApartments().size())
                .sum());

        return blockDTO;
    }
}