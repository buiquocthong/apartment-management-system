package vn.apartment.master.interactor.apartment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.ApartmentPageDTO;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.service.ApartmentService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListApartment {
    @Autowired
    private ApartmentService apartmentService;

    @Autowired
    private ApartmentMapper apartmentMapper;

    @Transactional(readOnly = true)
    public ApartmentPageDTO execute(ApiQuery apiQuery) {
        Page<Apartment> pageResult = apartmentService.findMatchingApartments(apiQuery);
        List<SimpleApartmentDTO> dtos = pageResult.get()
                .map(apartmentMapper::toSimpleDTO)
                .collect(Collectors.toList());
        return new ApartmentPageDTO(pageResult.getTotalElements(), dtos);
    }
}
