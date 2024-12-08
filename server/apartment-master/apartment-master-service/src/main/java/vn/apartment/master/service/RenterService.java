package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dao.RenterRepo;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Renter;

import java.util.List;
import java.util.Optional;

import static vn.apartment.master.dao.spec.RenterQuerySpec.newSpecification;
import static vn.apartment.master.dao.spec.RenterQuerySpec.supportedFields;

@Service
public class RenterService {

    private static final Logger LOG = LoggerFactory.getLogger(RenterService.class);

    @Autowired
    private RenterRepo renterRepo;
    @Autowired
    private RecordService recordService;

    public void saveOrUpdate(Renter renter) {
        renterRepo.save(renter);
    }

    public void delete(final String renterId) {
        Renter hadRenter = findRenterById(renterId);
        hadRenter.setDeleted(true);
    }

    public Renter findRenterById(final String renterId) {
        Optional<Renter> hadRenter = retrieveRenterByRenterId(renterId);
        if (!hadRenter.isPresent()) {
            throw new ResourceNotFoundException("The renter by " + renterId + " not found.");
        }
        return hadRenter.get();
    }

    public Renter findRenterByRecord(final String recordId) {
        Optional<Renter> hadRenter = retrieveRenterByRecordId(recordId);
        if (!hadRenter.isPresent()) {
            throw new ResourceNotFoundException("The renter by " + recordId + " not found.");
        }
        return hadRenter.get();
    }

    public List<Renter> getRenterByRecord(final String recordId) {
        Record hadRecord = recordService.findRecordByRecordId(recordId);
        return renterRepo.findByRecordId(recordId);
    }

    public List<Renter> getOldRenterByRecord(final String recordId) {
        Record hadRecord = recordService.findRecordByRecordId(recordId);
        return renterRepo.findOldRentersByRecordId(recordId);
    }

    public Optional<Renter> retrieveRenterByRenterId(final String renterId) {
        return renterRepo.findByRenterId(renterId);
    }

    public Optional<Renter> retrieveRenterByRecordId(final String recordId) {
        return renterRepo.findHeadByRecordId(recordId);
    }

    public Page<Renter> findMatchingRenters(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return renterRepo.findAll(newSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }
}
