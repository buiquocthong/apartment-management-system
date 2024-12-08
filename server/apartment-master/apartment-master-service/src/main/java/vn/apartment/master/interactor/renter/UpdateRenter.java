package vn.apartment.master.interactor.renter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.renter.UpdateRenterDTO;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.RenterService;

@Interactor
public class UpdateRenter {
    @Autowired
    private RenterService renterService;
    @Autowired
    private RenterMapper renterMapper;

    @Transactional
    public void execute(UpdateRenterDTO updateRenterDTO) {
        Renter hadRenter = renterService.findRenterById(updateRenterDTO.getRenterId());
        renterMapper.update(updateRenterDTO, hadRenter);
        renterService.saveOrUpdate(hadRenter);
    }
}
