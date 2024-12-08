package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.record.AddRecordDTO;
import vn.apartment.master.dto.record.RecordDTO;
import vn.apartment.master.dto.record.UpdateRecordDTO;
import vn.apartment.master.entity.record.Record;

@Mapper(componentModel = "spring", uses = {OwnerMapper.class})
public interface RecordMapper {
    RecordDTO toDTO(Record record);
    Record toEntity(AddRecordDTO recordDTO);
    void update(UpdateRecordDTO recordDTO, @MappingTarget Record record);
}
