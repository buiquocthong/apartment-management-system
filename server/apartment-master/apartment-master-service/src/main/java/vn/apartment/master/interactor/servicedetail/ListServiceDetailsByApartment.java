package vn.apartment.master.interactor.servicedetail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;
import vn.apartment.master.mapper.ServiceDetailMapper;
import vn.apartment.master.service.ServiceDetailService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListServiceDetailsByApartment {

    @Autowired
    private ServiceDetailService serviceDetailService;

    @Autowired
    private ServiceDetailMapper serviceDetailMapper;

    @Transactional(readOnly = true)
    public List<ServiceDetailDTO> execute(final String apartmentId) {
        return serviceDetailService.getServiceDetailByApartment(apartmentId)
                .stream().map(serviceDetailMapper::toDTO)
                .collect(Collectors.toList());
    }
}
