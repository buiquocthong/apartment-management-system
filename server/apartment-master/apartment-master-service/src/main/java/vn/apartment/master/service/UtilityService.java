package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.core.model.exception.ResourceAlreadyExistedException;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.master.dao.ServiceRepo;
import vn.apartment.master.entity.service.Service;

import java.util.List;
import java.util.Optional;

@Component
public class UtilityService {

    private static final Logger LOG = LoggerFactory.getLogger(UtilityService.class);

    @Autowired
    private ServiceRepo serviceRepo;

    public Service saveOrUpdate(Service service) {
        return serviceRepo.save(service);
    }

    public void delete(final String serviceId){
        Service hadService = findServiceById(serviceId);
        serviceRepo.delete(hadService);
    }

    public List<Service> findAll() {
        return serviceRepo.findAll();
    }

    public Service findServiceById(final String serviceId) {
        Optional<Service> hadService = retrieveServiceById(serviceId);
        if (!hadService.isPresent()) {
            throw new ResourceNotFoundException("The service by " + serviceId + " not found.");
        }
        return hadService.get();
    }

    public Optional<Service> retrieveServiceById(final String serviceId) {
        return serviceRepo.findByServiceId(serviceId);
    }

    public Optional<Service> retrieveServiceByName(final String name) {
        return serviceRepo.findByName(name);
    }

    public void checkExistApartmentByName(String name) {
        Optional<Service> hadService = retrieveServiceByName(name);
        if (hadService.isPresent()) {
            throw new ResourceAlreadyExistedException("The service by " + name + " already existed.");
        }
    }
}
