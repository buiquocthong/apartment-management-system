package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.model.exception.ResourceAlreadyExistedException;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dao.ApartmentRepo;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.apartment.Floor;

import java.util.List;
import java.util.Optional;

import static vn.apartment.master.dao.spec.ApartmentQuerySpec.newSpecification;
import static vn.apartment.master.dao.spec.ApartmentQuerySpec.supportedFields;

@Service
public class ApartmentService {

    private static final Logger LOG = LoggerFactory.getLogger(ApartmentService.class);

    @Autowired
    private ApartmentRepo apartmentRepo;
    @Autowired
    private FloorService floorService;

    public Apartment saveOrUpdate(Apartment apartment) {
        return apartmentRepo.save(apartment);
    }

    public List<Apartment> saveAll(List<Apartment> apartments) {
        return apartmentRepo.saveAll(apartments);
    }

    public void delete(final String apartmentId) {
        Apartment hadApartment = findApartmentById(apartmentId);
        if (hadApartment.getStatus() != ApartmentStatus.AVAILABLE) {
            throw new InvalidParameterException("Apartment is not available");
        }
        apartmentRepo.delete(hadApartment);
    }

    public Apartment findApartmentById(final String apartmentId){
        Optional<Apartment> hadApartment = retrieveApartmentById(apartmentId);
        if (!hadApartment.isPresent()) {
            throw new ResourceNotFoundException("The apartment by " + apartmentId + " not found.");
        }
        return hadApartment.get();
    }

    public Apartment findApartmentByOwner(final String ownerId) {
        Optional<Apartment> hadApartment = retrieveApartmentByOwnerId(ownerId);
        if (!hadApartment.isPresent()) {
            throw new ResourceNotFoundException("The apartment by " + ownerId + " not found.");
        }
        return hadApartment.get();
    }

    public Apartment findApartmentByHousehold(final String householdId){
        Optional<Apartment> hadApartment = retrieveApartmentByHouseholdId(householdId);
        if (!hadApartment.isPresent()) {
            throw new ResourceNotFoundException("The apartment by " + householdId + " not found.");
        }
        return hadApartment.get();
    }

    public Apartment findApartmentByInvoice(final String invoiceId){
        Optional<Apartment> hadApartment = retrieveApartmentByInvoiceId(invoiceId);
        if (!hadApartment.isPresent()) {
            throw new ResourceNotFoundException("The apartment by " + invoiceId + " not found.");
        }
        return hadApartment.get();
    }

    public List<Apartment> getApartmentByFloor(final String floorId) {
        Floor hadFloor = floorService.findFloorById(floorId);
        return apartmentRepo.findByFloorId(floorId);
    }

    public Optional<Apartment> retrieveApartmentById(final String apartmentId) {
        return apartmentRepo.findByApartmentId(apartmentId);
    }

    public Optional<Apartment> retrieveApartmentByName(final String name) {
        return apartmentRepo.findByName(name);
    }

    public Optional<Apartment> retrieveApartmentByOwnerId(final String ownerId) {
        return apartmentRepo.findByOwnerId(ownerId);
    }

    public Optional<Apartment> retrieveApartmentByHouseholdId(final String householdId) {
        return apartmentRepo.findByHouseholdId(householdId);
    }

    public Optional<Apartment> retrieveApartmentByInvoiceId(final String invoiceId){
        return apartmentRepo.findByInvoiceId(invoiceId);
    }

    public void checkExistApartmentByName(String name) {
        Optional<Apartment> hadApartment = retrieveApartmentByName(name);
        if (hadApartment.isPresent()) {
            throw new ResourceAlreadyExistedException("The apartment by " + name + " already existed.");
        }
    }

    public Page<Apartment> findMatchingApartments(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return apartmentRepo.findAll(newSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }
}
