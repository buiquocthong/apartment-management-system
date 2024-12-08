package vn.apartment.master.interactor.record;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.record.RecordDTO;
import vn.apartment.master.dto.renter.RenterDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.mapper.RecordMapper;
import vn.apartment.master.mapper.RenterMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.HouseholdService;
import vn.apartment.master.service.RecordService;
import vn.apartment.master.service.RenterService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class FindRecord {
    @Autowired
    private RecordService recordService;
    @Autowired
    private RecordMapper recordMapper;
    @Autowired
    private HouseholdService householdService;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private RenterService renterService;
    @Autowired
    private ApartmentMapper apartmentMapper;
    @Autowired
    private RenterMapper renterMapper;

    @Transactional(readOnly = true)
    public RecordDTO execute(final String recordId){
        if (ObjectUtils.isEmpty(recordId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        Record hadRecord = recordService.findRecordByRecordId(recordId);
        RecordDTO dto = recordMapper.toDTO(recordService.findRecordByRecordId(recordId));
        Apartment hadApartment = apartmentService.findApartmentByOwner(hadRecord.getOwner().getOwnerId());
        dto.getOwner().setApartment(apartmentMapper.toSimpleDTO(hadApartment));
        List<RenterDTO> hadRenters = renterService.getRenterByRecord(recordId)
                .stream().map(renterMapper::toDTO).collect(Collectors.toList());
        dto.setRenters(hadRenters);
        return dto;
    }
}
