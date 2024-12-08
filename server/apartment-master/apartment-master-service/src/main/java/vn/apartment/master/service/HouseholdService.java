package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dao.HouseHoldRepo;
import vn.apartment.master.entity.resident.Household;

import java.util.Optional;

import static vn.apartment.master.dao.spec.HouseholdQuerySpec.newSpecification;
import static vn.apartment.master.dao.spec.HouseholdQuerySpec.supportedFields;

@Service
public class HouseholdService {

    private static final Logger LOG = LoggerFactory.getLogger(HouseholdService.class);

    @Autowired
    private HouseHoldRepo houseHoldRepo;

    public Household saveOrUpdate(Household household) {
        return houseHoldRepo.save(household);
    }

    public void delete(final String householdId) {
        Household hadHousehold = findHouseholdById(householdId);
        hadHousehold.setDeleted(true);
    }

    public Household findHouseholdById(final String householdId) {
        Optional<Household> hadHousehold = retrieveHouseholdById(householdId);
        if (!hadHousehold.isPresent()) {
            throw new ResourceNotFoundException("The household by " + householdId + " not found.");
        }
        return hadHousehold.get();
    }

    public Household findHouseholdByOwner(final String ownerId) {
        Optional<Household> hadHousehold = retrieveHouseholdByOwnerId(ownerId);
        if (!hadHousehold.isPresent()) {
            throw new ResourceNotFoundException("The household by " + ownerId + " not found.");
        }
        return hadHousehold.get();
    }

    public Optional<Household> retrieveHouseholdById(final String householdId) {
        return houseHoldRepo.findByHouseholdId(householdId);
    }

    public Optional<Household> retrieveHouseholdByOwnerId(final String ownerId) {
        return houseHoldRepo.findByOwnerId(ownerId);
    }

    public Page<Household> findMatchingHouseholds(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return houseHoldRepo.findAll(newSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }
}
