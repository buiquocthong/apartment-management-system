package vn.apartment.master.interactor.apartment;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.UpdateApartmentDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.BlockService;

@Interactor
public class UpdateApartment {
    @Autowired
    private ApartmentService apartmentService;

    @Autowired
    private ApartmentMapper apartmentMapper;

    @Autowired
    private BlockService blockService;

    @Transactional
    public void execute(UpdateApartmentDTO updateApartment) {
        Apartment hadApartment = apartmentService.findApartmentById(updateApartment.getApartmentId());
        apartmentMapper.update(updateApartment, hadApartment);
        apartmentService.saveOrUpdate(hadApartment);
    }
}
