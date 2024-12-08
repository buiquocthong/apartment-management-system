package vn.apartment.master.interactor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.service.ServiceDTO;
import vn.apartment.master.mapper.ServiceMapper;
import vn.apartment.master.service.UtilityService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListService {

    @Autowired
    private UtilityService utilityService;

    @Autowired
    private ServiceMapper serviceMapper;

    @Transactional(readOnly = true)
    public List<ServiceDTO> execute() {
        return utilityService.findAll()
                .stream().map(serviceMapper::toDTO)
                .collect(Collectors.toList());
    }
}
