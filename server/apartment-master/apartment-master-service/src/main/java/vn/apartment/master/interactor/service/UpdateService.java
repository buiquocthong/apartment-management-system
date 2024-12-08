package vn.apartment.master.interactor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.service.UpdateServiceDTO;
import vn.apartment.master.entity.service.Service;
import vn.apartment.master.mapper.ServiceMapper;
import vn.apartment.master.service.UtilityService;

@Interactor
public class UpdateService {
    @Autowired
    private UtilityService utilityService;

    @Autowired
    private ServiceMapper serviceMapper;

    @Transactional
    public void execute(UpdateServiceDTO serviceDTO) {
        Service hadService = utilityService.findServiceById(serviceDTO.getServiceId());
        serviceMapper.update(serviceDTO, hadService);
        utilityService.saveOrUpdate(hadService);
    }
}
