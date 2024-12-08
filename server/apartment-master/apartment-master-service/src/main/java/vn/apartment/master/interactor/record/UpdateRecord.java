package vn.apartment.master.interactor.record;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.record.UpdateRecordDTO;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.mapper.RecordMapper;
import vn.apartment.master.service.OwnerService;
import vn.apartment.master.service.RecordService;
import vn.apartment.master.service.RenterService;

import java.util.List;

@Interactor
public class UpdateRecord {
    @Autowired
    private RecordService recordService;
    @Autowired
    private RecordMapper recordMapper;
    @Autowired
    private RenterService renterService;
    @Autowired
    private OwnerService ownerService;

    @Transactional
    public void execute(UpdateRecordDTO updateRecordDTO) {
        Record hadRecord = recordService.findRecordByRecordId(updateRecordDTO.getRecordId());
        hadRecord.setEndDate(updateRecordDTO.getEndDate());
        if (hadRecord.isDeleted()) {
            hadRecord.setDeleted(false);
            List<Renter> hadRenters = renterService.getOldRenterByRecord(updateRecordDTO.getRecordId());
            hadRenters.forEach(hadRenter -> {
                hadRenter.setDeleted(false);
                renterService.saveOrUpdate(hadRenter);
            });
            Owner hadOwner = ownerService.findOwnerByRecord(updateRecordDTO.getRecordId());
            hadOwner.setOccupancy(false);
        }
        recordService.saveOrUpdate(hadRecord);
    }
}
