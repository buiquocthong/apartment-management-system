package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.renter.AddRenterDTO;
import vn.apartment.master.dto.renter.RenterDTO;
import vn.apartment.master.dto.renter.UpdateRenterDTO;
import vn.apartment.master.dto.resident.ResidentDTO;
import vn.apartment.master.entity.resident.Renter;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class RenterMapperImpl implements RenterMapper {

    @Override
    public RenterDTO toDTO(Renter renter) {
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

    @Override
    public Renter toEntity(AddRenterDTO renterDTO) {
        if ( renterDTO == null ) {
            return null;
        }

        Renter renter = new Renter();

        renter.setBirthday( renterDTO.getBirthday() );
        renter.setCareer( renterDTO.getCareer() );
        renter.setCity( renterDTO.getCity() );
        renter.setDistrict( renterDTO.getDistrict() );
        renter.setEmail( renterDTO.getEmail() );
        renter.setFirstName( renterDTO.getFirstName() );
        renter.setGender( renterDTO.getGender() );
        renter.setIdCardNumber( renterDTO.getIdCardNumber() );
        renter.setLastName( renterDTO.getLastName() );
        renter.setMiddleName( renterDTO.getMiddleName() );
        renter.setPhoneNumber( renterDTO.getPhoneNumber() );
        renter.setStreet( renterDTO.getStreet() );
        renter.setWard( renterDTO.getWard() );

        return renter;
    }

    @Override
    public ResidentDTO toResident(Renter renter) {
        if ( renter == null ) {
            return null;
        }

        ResidentDTO residentDTO = new ResidentDTO();

        residentDTO.setBirthday( renter.getBirthday() );
        residentDTO.setCareer( renter.getCareer() );
        residentDTO.setCity( renter.getCity() );
        residentDTO.setDistrict( renter.getDistrict() );
        residentDTO.setEmail( renter.getEmail() );
        residentDTO.setFirstName( renter.getFirstName() );
        residentDTO.setGender( renter.getGender() );
        residentDTO.setHouseholdHead( renter.getHouseholdHead() );
        residentDTO.setIdCardNumber( renter.getIdCardNumber() );
        residentDTO.setLastName( renter.getLastName() );
        residentDTO.setMiddleName( renter.getMiddleName() );
        residentDTO.setPhoneNumber( renter.getPhoneNumber() );
        residentDTO.setStreet( renter.getStreet() );
        residentDTO.setWard( renter.getWard() );

        return residentDTO;
    }

    @Override
    public void update(UpdateRenterDTO addRenterDTO, Renter renter) {
        if ( addRenterDTO == null ) {
            return;
        }

        renter.setRenterId( addRenterDTO.getRenterId() );
        renter.setBirthday( addRenterDTO.getBirthday() );
        renter.setCareer( addRenterDTO.getCareer() );
        renter.setCity( addRenterDTO.getCity() );
        renter.setDistrict( addRenterDTO.getDistrict() );
        renter.setEmail( addRenterDTO.getEmail() );
        renter.setFirstName( addRenterDTO.getFirstName() );
        renter.setGender( addRenterDTO.getGender() );
        renter.setIdCardNumber( addRenterDTO.getIdCardNumber() );
        renter.setHouseholdHead( addRenterDTO.getHouseholdHead() );
        renter.setLastName( addRenterDTO.getLastName() );
        renter.setMiddleName( addRenterDTO.getMiddleName() );
        renter.setPhoneNumber( addRenterDTO.getPhoneNumber() );
        renter.setStreet( addRenterDTO.getStreet() );
        renter.setWard( addRenterDTO.getWard() );
    }
}
