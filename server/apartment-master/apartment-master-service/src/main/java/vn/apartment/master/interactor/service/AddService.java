package vn.apartment.master.interactor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.service.AddServiceDTO;
import vn.apartment.master.entity.service.Service;
import vn.apartment.master.mapper.ServiceMapper;
import vn.apartment.master.service.UtilityService;

@Interactor
public class AddService {

    @Autowired
    private UtilityService utilityService;

    @Autowired
    private ServiceMapper serviceMapper;

    public void execute(AddServiceDTO serviceDTO) {

        if (serviceDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }
        utilityService.checkExistApartmentByName(serviceDTO.getName());
        Service newService = saveNewService(serviceDTO);
    }

    @Transactional
    public Service saveNewService(AddServiceDTO serviceDTO) {
        Service newService = serviceMapper.toEntity(serviceDTO);
        newService.setServiceId(Generators.uuid());
        return utilityService.saveOrUpdate(newService);
    }
}
