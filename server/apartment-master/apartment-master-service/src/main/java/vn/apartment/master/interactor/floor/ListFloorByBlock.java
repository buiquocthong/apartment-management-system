package vn.apartment.master.interactor.floor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.dto.floor.FloorDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.apartment.Floor;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.mapper.FloorMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.FloorService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListFloorByBlock {

    @Autowired
    private FloorService floorService;
    @Autowired
    private FloorMapper floorMapper;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private ApartmentMapper apartmentMapper;

    @Transactional(readOnly = true)
    public List<FloorDTO> execute(final String blockId) {
        List<Floor> floors = floorService.getFloorByBlock(blockId);
        return floors.stream()
                .map(floor -> {
                    FloorDTO hadFloor = floorMapper.toDTO(floor);
                    List<Apartment> apartments = apartmentService.getApartmentByFloor(floor.getFloorId());
                    List<SimpleApartmentDTO> hadApartmentList = apartments.stream()
                            .map(apartmentMapper::toSimpleDTO)
                            .collect(Collectors.toList());
                    hadFloor.setApartments(hadApartmentList);
                    return hadFloor;
                })
                .collect(Collectors.toList());
    }
}
