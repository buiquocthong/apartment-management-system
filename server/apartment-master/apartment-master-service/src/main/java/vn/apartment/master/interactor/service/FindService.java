package vn.apartment.master.interactor.service;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.service.ServiceDTO;
import vn.apartment.master.mapper.ServiceMapper;
import vn.apartment.master.service.UtilityService;

@Interactor
public class FindService {

    @Autowired
    private UtilityService utilityService;

    @Autowired
    private ServiceMapper serviceMapper;

    @Transactional(readOnly = true)
    public ServiceDTO execute(String serviceId) {

        if (ObjectUtils.isEmpty(serviceId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }

        return serviceMapper.toDTO(utilityService.findServiceById(serviceId));
    }
}
