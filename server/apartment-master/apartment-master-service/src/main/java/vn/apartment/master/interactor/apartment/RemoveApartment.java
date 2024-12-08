package vn.apartment.master.interactor.apartment;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.entity.apartment.Block;
import vn.apartment.master.entity.service.ServiceDetail;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.BlockService;
import vn.apartment.master.service.ServiceDetailService;

import java.util.List;

@Interactor
public class RemoveApartment {

    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private ServiceDetailService serviceDetailService;
    @Autowired
    private BlockService blockService;

    @Transactional
    public void execute(final String apartmentId){
        if (ObjectUtils.isEmpty(apartmentId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }

        Block hadBlock = blockService.findBlockByApartment(apartmentId);
        hadBlock.setTotalApartment(hadBlock.getTotalApartment() - 1);
        blockService.saveOrUpdate(hadBlock);

        List<ServiceDetail> serviceDetails = serviceDetailService.getServiceDetailByApartment(apartmentId);
        serviceDetails.forEach(serviceDetail ->
                serviceDetailService.delete(serviceDetail.getServiceDetailId())
        );

        apartmentService.delete(apartmentId);
    }
}
