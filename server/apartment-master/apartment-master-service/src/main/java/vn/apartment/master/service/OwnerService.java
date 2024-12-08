package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dao.OwnerRepo;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.entity.resident.Owner;

import java.util.List;
import java.util.Optional;

import static vn.apartment.master.dao.spec.OwnerQuerySpec.newSpecification;
import static vn.apartment.master.dao.spec.OwnerQuerySpec.supportedFields;

@Service
public class OwnerService {

    private static final Logger LOG = LoggerFactory.getLogger(OwnerService.class);

    @Autowired
    private OwnerRepo ownerRepo;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private HouseholdService householdService;
    @Autowired
    private RecordService recordService;

    public Owner saveOrUpdate(Owner owner) {
        return ownerRepo.save(owner);
    }

    public void delete(final String ownerId) {
        Owner hadOwner = findOwnerById(ownerId);
        hadOwner.setDeleted(true);
    }

    @Transactional(readOnly = true)
    public Owner findOwnerByApartment(final String apartmentId){
        Apartment hadApartment = apartmentService.findApartmentById(apartmentId);
        Optional<Owner> hadOwner = retrieveOwnerByApartmentId(apartmentId);
        if (!hadOwner.isPresent()) {
            throw new ResourceNotFoundException("The owner by " + apartmentId + " not found.");
        }
        return hadOwner.get();
    }

    public Owner findHeadOwnerById(final String ownerId) {
        Optional<Owner> hadOwner = retrieveHeadOwnerById(ownerId);
        if (!hadOwner.isPresent()) {
            throw new ResourceNotFoundException("The owner by " + ownerId + " not found.");
        }
        return hadOwner.get();
    }

    public Owner findOwnerById(final String ownerId) {
        Optional<Owner> hadOwner = retrieveOwnerById(ownerId);
        if (!hadOwner.isPresent()) {
            throw new ResourceNotFoundException("The owner by " + ownerId + " not found.");
        }
        return hadOwner.get();
    }

    @Transactional(readOnly = true)
    public List<Owner> getOwnerByHousehold(final String householdId) {
        Household hadHousehold = householdService.findHouseholdById(householdId);
        return ownerRepo.findByHouseholdId(householdId);
    }

    public Owner findOwnerByRecord(final String recordId){
        Record hadRecord = recordService.findRecordByRecordId(recordId);
        Optional<Owner> hadOwner = retrieveOwnerByRecordId(recordId);
        if (!hadOwner.isPresent()) {
            throw new ResourceNotFoundException("The owner by " + recordId + " not found.");
        }
        return hadOwner.get();
    }

    public Optional<Owner> retrieveHeadOwnerById(final String ownerId) {
        return ownerRepo.findHeadByOwnerId(ownerId);
    }

    public Optional<Owner> retrieveOwnerById(final String ownerId) {
        return ownerRepo.findByOwnerId(ownerId);
    }

    public Optional<Owner> retrieveOwnerByApartmentId(final String apartmentId){
        return ownerRepo.findByApartmentId(apartmentId);
    }

    public Optional<Owner> retrieveOwnerByRecordId(final String recordId) {
        return ownerRepo.findByRecordId(recordId);
    }

    public Page<Owner> findMatchingOwners(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return ownerRepo.findAll(newSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }
}
