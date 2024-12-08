package vn.apartment.master.interactor.record;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.record.RecordDTO;
import vn.apartment.master.dto.record.RecordPageDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.mapper.RecordMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.RecordService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListExpiredRecord {
    @Autowired
    private RecordService recordService;
    @Autowired
    private RecordMapper recordMapper;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private ApartmentMapper apartmentMapper;

    @Transactional(readOnly = true)
    public RecordPageDTO execute(ApiQuery apiQuery) {
        Page<Record> pageResult = recordService.findMatchingExpiredRecords(apiQuery);
        List<RecordDTO> dtos =  pageResult
                .get()
                .map( record -> {
                    RecordDTO hadRecord = recordMapper.toDTO(record);
                    Apartment hadApartment = apartmentService.findApartmentByOwner(hadRecord.getOwner().getOwnerId());
                    hadRecord.getOwner().setApartment(apartmentMapper.toSimpleDTO(hadApartment));
                    return hadRecord;
                })
                .collect(Collectors.toList());
        return new RecordPageDTO(pageResult.getTotalElements(), dtos);
    }
}
