package vn.apartment.master.interactor.service;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.entity.service.ServiceDetail;
import vn.apartment.master.service.ServiceDetailService;
import vn.apartment.master.service.UtilityService;

import java.util.List;

@Interactor
public class RemoveService {
    @Autowired
    private UtilityService utilityService;
    @Autowired
    private ServiceDetailService serviceDetailService;

    @Transactional
    public void execute(final String serviceId){
        if (ObjectUtils.isEmpty(serviceId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        List<ServiceDetail> serviceDetails = serviceDetailService.getServiceDetailByService(serviceId);
        serviceDetails.forEach(serviceDetail ->
                serviceDetailService.delete(serviceDetail.getServiceDetailId())
        );
        utilityService.delete(serviceId);
    }
}
