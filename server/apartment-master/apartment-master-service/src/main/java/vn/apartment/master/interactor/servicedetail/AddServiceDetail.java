package vn.apartment.master.interactor.servicedetail;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.dto.servicedetail.AddServiceDetailDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.service.Service;
import vn.apartment.master.entity.service.ServiceDetail;
import vn.apartment.master.mapper.ServiceDetailMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.ServiceDetailService;
import vn.apartment.master.service.UtilityService;

import java.math.BigDecimal;

@Interactor
public class AddServiceDetail {

    @Autowired
    private ServiceDetailService serviceDetailService;

    @Autowired
    private ServiceDetailMapper serviceDetailMapper;

    @Autowired
    private ApartmentService apartmentService;

    @Autowired
    private UtilityService utilityService;

    public void execute(AddServiceDetailDTO serviceDetailDTO) {

        if (serviceDetailDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }

        ServiceDetail newServiceDetail = saveNewServiceDetail(serviceDetailDTO);
    }

    @Transactional
    public ServiceDetail saveNewServiceDetail(AddServiceDetailDTO serviceDetailDTO) {
        Apartment hadApartment = apartmentService.findApartmentById(serviceDetailDTO.getApartmentId());
        Service hadService = utilityService.findServiceById(serviceDetailDTO.getServiceId());
        ServiceDetail newServiceDetail = serviceDetailMapper.toEntity(serviceDetailDTO);
        newServiceDetail.setServiceDetailId(Generators.uuid());
        newServiceDetail.setApartment(hadApartment);
        newServiceDetail.setService(hadService);
        newServiceDetail.setOldValue(0);
        newServiceDetail.setNewValue(hadApartment.getStatus() == ApartmentStatus.AVAILABLE ? 0 : newServiceDetail.getNewValue());
        newServiceDetail.setAmountOfUsing(newServiceDetail.getNewValue() - newServiceDetail.getOldValue());
        if (hadService.getMeteredService().equals(Boolean.TRUE)){
            newServiceDetail.setAmountOfUsing(newServiceDetail.getNewValue() - newServiceDetail.getOldValue());
        } else {
            newServiceDetail.setAmountOfUsing(serviceDetailDTO.getAmountOfUsing());
        }
        newServiceDetail.setMoney(BigDecimal.valueOf(newServiceDetail.getAmountOfUsing()).multiply(hadService.getPrice()));
        return serviceDetailService.saveOrUpdate(newServiceDetail);
    }
}
