package vn.apartment.master.interactor.apartment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.service.ApartmentService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListApartmentsByFloor {

    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private ApartmentMapper apartmentMapper;

    @Transactional(readOnly = true)
    public List<SimpleApartmentDTO> execute(final String floorId) {
        return apartmentService.getApartmentByFloor(floorId)
                .stream().map(apartmentMapper::toSimpleDTO)
                .collect(Collectors.toList());
    }
}
