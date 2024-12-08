package vn.apartment.master.interactor.floor;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.floor.FloorDTO;
import vn.apartment.master.mapper.FloorMapper;
import vn.apartment.master.service.FloorService;

@Interactor
public class FindFloor {
    @Autowired
    private FloorService floorService;
    @Autowired
    private FloorMapper floorMapper;

    @Transactional(readOnly = true)
    public FloorDTO execute(final String floorId){
        if (ObjectUtils.isEmpty(floorId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        return floorMapper.toDTO(floorService.findFloorById(floorId));
    }
}
