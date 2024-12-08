package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dao.RecordRepo;
import vn.apartment.master.entity.record.Record;

import java.util.List;
import java.util.Optional;

import static vn.apartment.master.dao.spec.RecordQuerySpec.*;


@Service
public class RecordService {

    private static final Logger LOG = LoggerFactory.getLogger(RecordService.class);

    @Autowired
    private RecordRepo recordRepo;

    public void saveOrUpdate(Record record) {
        recordRepo.save(record);
    }

    public void delete(final String recordId) {
        Record hadRecord = findRecordByRecordId(recordId);
        hadRecord.setDeleted(true);
    }

    public Record findRecordByRecordId(final String recordId) {
        Optional<Record> hadRecord = retrieveRecordByRecordId(recordId);
        if (!hadRecord.isPresent()) {
            throw new ResourceNotFoundException("The record by " + recordId + " not found.");
        }
        return hadRecord.get();
    }

    public Record findRecordByOwner(final String ownerId) {
        Optional<Record> hadRecord = retrieveRecordByOwnerId(ownerId);
        if (!hadRecord.isPresent()) {
            throw new ResourceNotFoundException("The record by " + ownerId + " not found.");
        }
        return hadRecord.get();
    }

    public List<Record> getActiveRecords(){
        return recordRepo.findActiveRecords();
    }

    public Optional<Record> retrieveRecordByRecordId(final String recordId) {
        return recordRepo.findByRecordId(recordId);
    }

    public Optional<Record> retrieveRecordByOwnerId(final String  ownerId) {
        return recordRepo.findByOwnerId(ownerId);
    }

    public Page<Record> findMatchingRecords(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return recordRepo.findAll(newSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }

    public Page<Record> findMatchingExpiredRecords(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return recordRepo.findAll(softSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }
}
