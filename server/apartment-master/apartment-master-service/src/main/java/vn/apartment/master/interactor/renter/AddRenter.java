package vn.apartment.master.interactor.renter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.renter.AddRenterDTO;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Renter;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.RecordService;
import vn.apartment.master.service.RenterService;

@Interactor
public class AddRenter {
    @Autowired
    private RenterService renterService;
    @Autowired
    private RenterMapper renterMapper;
    @Autowired
    private RecordService recordService;

    public void execute(AddRenterDTO renterDTO){
        if (renterDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }
        saveNewRenter(renterDTO);
    }

    @Transactional
    public void saveNewRenter(AddRenterDTO renterDTO) {
        Record hadRecord = recordService.findRecordByRecordId(renterDTO.getRecordId());
        Renter newRenter = renterMapper.toEntity(renterDTO);
        newRenter.setRenterId(Generators.uuid());
        newRenter.setRecord(hadRecord);
        newRenter.setHouseholdHead(false);
        renterService.saveOrUpdate(newRenter);
    }
}
