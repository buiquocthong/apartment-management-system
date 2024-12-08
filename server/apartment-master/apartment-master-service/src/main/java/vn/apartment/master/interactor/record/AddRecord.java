package vn.apartment.master.interactor.record;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.record.AddRecordDTO;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.mapper.RecordMapper;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.OwnerService;
import vn.apartment.master.service.RecordService;
import vn.apartment.master.service.RenterService;

import java.util.List;

@Interactor
public class AddRecord {
    @Autowired
    private RecordService recordService;
    @Autowired
    private RecordMapper recordMapper;
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private RenterService renterService;
    @Autowired
    private RenterMapper renterMapper;

    @Transactional
    public void execute(AddRecordDTO recordDTO) {
        if (recordDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }
        saveNewRecord(recordDTO);
    }

    @Transactional
    public void saveNewRecord(AddRecordDTO recordDTO) {
        Owner hadOwner = ownerService.findHeadOwnerById(recordDTO.getOwnerId());
        hadOwner.setOccupancy(false);
        List<Owner> hadOwners = ownerService.getOwnerByHousehold(hadOwner.getHousehold().getHouseholdId());
        hadOwners.forEach(owner -> owner.setOccupancy(false));

        Renter newRenter = renterMapper.toEntity(recordDTO.getRenter());
        newRenter.setRenterId(Generators.uuid());
        newRenter.setHouseholdHead(true);

        Record newRecord = recordMapper.toEntity(recordDTO);
        newRecord.setRecordId(Generators.uuid());
        newRecord.setOwner(hadOwner);
        newRecord.setRenters(List.of(newRenter));

        newRenter.setRecord(newRecord);
        recordService.saveOrUpdate(newRecord);
    }
}
