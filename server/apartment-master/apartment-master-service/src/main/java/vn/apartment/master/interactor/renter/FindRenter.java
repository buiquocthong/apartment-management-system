package vn.apartment.master.interactor.renter;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.renter.RenterDTO;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.RenterService;

@Interactor
public class FindRenter {
    @Autowired
    private RenterService renterService;
    @Autowired
    private RenterMapper renterMapper;

    @Transactional(readOnly = true)
    public RenterDTO execute(final String renterId){
        if (ObjectUtils.isEmpty(renterId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        return renterMapper.toDTO(renterService.findRenterById(renterId));
    }
}
