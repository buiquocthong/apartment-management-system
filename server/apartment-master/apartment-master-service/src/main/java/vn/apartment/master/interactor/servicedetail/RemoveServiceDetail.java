package vn.apartment.master.interactor.servicedetail;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.service.ServiceDetailService;

@Interactor
public class RemoveServiceDetail {
    @Autowired
    private ServiceDetailService serviceDetailService;

    @Transactional
    public void execute(final String serviceDetailId) {
        if (ObjectUtils.isEmpty(serviceDetailId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        serviceDetailService.delete(serviceDetailId);
    }
}
