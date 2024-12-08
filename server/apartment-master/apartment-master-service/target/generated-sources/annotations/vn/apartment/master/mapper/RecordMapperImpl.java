package vn.apartment.master.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.record.AddRecordDTO;
import vn.apartment.master.dto.record.RecordDTO;
import vn.apartment.master.dto.record.UpdateRecordDTO;
import vn.apartment.master.dto.renter.RenterDTO;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Renter;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:26+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class RecordMapperImpl implements RecordMapper {

    @Autowired
    private OwnerMapper ownerMapper;

    @Override
    public RecordDTO toDTO(Record record) {
        if ( record == null ) {
            return null;
        }

        RecordDTO recordDTO = new RecordDTO();

        recordDTO.setCreateDate( record.getCreateDate() );
        recordDTO.setEndDate( record.getEndDate() );
        recordDTO.setOwner( ownerMapper.toDTO( record.getOwner() ) );
        recordDTO.setRecordId( record.getRecordId() );
        recordDTO.setRenters( renterListToRenterDTOList( record.getRenters() ) );
        recordDTO.setStartDate( record.getStartDate() );
        recordDTO.setUpdateDate( record.getUpdateDate() );

        return recordDTO;
    }

    @Override
    public Record toEntity(AddRecordDTO recordDTO) {
        if ( recordDTO == null ) {
            return null;
        }

        Record record = new Record();

        record.setStartDate( recordDTO.getStartDate() );
        record.setEndDate( recordDTO.getEndDate() );

        return record;
    }

    @Override
    public void update(UpdateRecordDTO recordDTO, Record record) {
        if ( recordDTO == null ) {
            return;
        }

        record.setRecordId( recordDTO.getRecordId() );
        record.setEndDate( recordDTO.getEndDate() );
    }

    protected RenterDTO renterToRenterDTO(Renter renter) {
        if ( renter == null ) {
            return null;
        }

        RenterDTO renterDTO = new RenterDTO();

        renterDTO.setBirthday( renter.getBirthday() );
        renterDTO.setCareer( renter.getCareer() );
        renterDTO.setCity( renter.getCity() );
        renterDTO.setCreateDate( renter.getCreateDate() );
        renterDTO.setDistrict( renter.getDistrict() );
        renterDTO.setEmail( renter.getEmail() );
        renterDTO.setFirstName( renter.getFirstName() );
        renterDTO.setGender( renter.getGender() );
        renterDTO.setHouseholdHead( renter.getHouseholdHead() );
        renterDTO.setIdCardNumber( renter.getIdCardNumber() );
        renterDTO.setLastName( renter.getLastName() );
        renterDTO.setMiddleName( renter.getMiddleName() );
        renterDTO.setPhoneNumber( renter.getPhoneNumber() );
        renterDTO.setRenterId( renter.getRenterId() );
        renterDTO.setStreet( renter.getStreet() );
        renterDTO.setUpdateDate( renter.getUpdateDate() );
        renterDTO.setWard( renter.getWard() );

        return renterDTO;
    }

    protected List<RenterDTO> renterListToRenterDTOList(List<Renter> list) {
        if ( list == null ) {
            return null;
        }

        List<RenterDTO> list1 = new ArrayList<RenterDTO>( list.size() );
        for ( Renter renter : list ) {
            list1.add( renterToRenterDTO( renter ) );
        }

        return list1;
    }
}
