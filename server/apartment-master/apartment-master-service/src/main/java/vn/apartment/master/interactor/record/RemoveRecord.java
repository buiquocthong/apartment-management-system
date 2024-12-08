package vn.apartment.master.interactor.record;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.service.OwnerService;
import vn.apartment.master.service.RecordService;
import vn.apartment.master.service.RenterService;

import java.util.List;

@Interactor
public class RemoveRecord {
    @Autowired
    private RecordService recordService;
    @Autowired
    private RenterService renterService;
    @Autowired
    private OwnerService ownerService;

    @Transactional
    public void execute(final String recordId){
        if (ObjectUtils.isEmpty(recordId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        Record hadRecord = recordService.findRecordByRecordId(recordId);
        List<Renter> hadRenters = renterService.getRenterByRecord(recordId);
        hadRenters.forEach(renter -> renterService.delete(renter.getRenterId()));
        Owner hadOwner = ownerService.findHeadOwnerById(hadRecord.getOwner().getOwnerId());
        hadOwner.setOccupancy(true);
        ownerService.saveOrUpdate(hadOwner);
        recordService.delete(recordId);
    }
}
