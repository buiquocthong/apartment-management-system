package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.master.dao.ServiceDetailRepo;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.service.ServiceDetail;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceDetailService {

    private static final Logger LOG = LoggerFactory.getLogger(ServiceDetailService.class);

    @Autowired
    private ServiceDetailRepo serviceDetailRepo;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private UtilityService utilityService;

    public ServiceDetail saveOrUpdate(ServiceDetail serviceDetail) {
        return serviceDetailRepo.save(serviceDetail);
    }

    public void delete(final String serviceDetailId){
        ServiceDetail hadServiceDetail = findServiceDetailById(serviceDetailId);
        serviceDetailRepo.delete(hadServiceDetail);
    }

    public ServiceDetail findServiceDetailById(final String serviceDetailId) {
        Optional<ServiceDetail> hadServiceDetail = retrieveServiceDetailById(serviceDetailId);
        if (!hadServiceDetail.isPresent()) {
            throw new ResourceNotFoundException("The service detail by " + serviceDetailId + " not found.");
        }
        return hadServiceDetail.get();
    }

    public List<ServiceDetail> getServiceDetailByApartment(final String apartmentId) {
        Apartment hadApartment = apartmentService.findApartmentById(apartmentId);
        return serviceDetailRepo.findByApartmentId(apartmentId);
    }

    public List<ServiceDetail> getServiceDetailByService(final String serviceId) {
        vn.apartment.master.entity.service.Service hadService = utilityService.findServiceById(serviceId);
        return serviceDetailRepo.findByServiceId(serviceId);
    }

    public Optional<ServiceDetail> retrieveServiceDetailById(String serviceDetailId) {
        return serviceDetailRepo.findByServiceDetailId(serviceDetailId);
    }
}
