package vn.apartment.master.interactor.renter;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.RenterService;

@Interactor
public class RemoveRenter {
    @Autowired
    private RenterService renterService;
    @Autowired
    private RenterMapper renterMapper;

    @Transactional
    public void execute(final String renterId) {
        if (ObjectUtils.isEmpty(renterId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        Renter hadRenter = renterService.findRenterById(renterId);
        if (hadRenter.getHouseholdHead().equals(Boolean.TRUE)) {
            throw new InvalidParameterException("You can not remove renter who is head");
        }
        renterService.delete(renterId);
    }
}
