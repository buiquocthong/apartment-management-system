package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.household.SimpleHouseholdDTO;
import vn.apartment.master.dto.owner.AddMemberDTO;
import vn.apartment.master.dto.owner.AddOwnerDTO;
import vn.apartment.master.dto.owner.OwnerDTO;
import vn.apartment.master.dto.owner.SimpleOwnerDTO;
import vn.apartment.master.dto.owner.UpdateOwnerDTO;
import vn.apartment.master.dto.resident.ResidentDTO;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.entity.resident.Owner;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:26+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class OwnerMapperImpl implements OwnerMapper {

    @Override
    public OwnerDTO toDTO(Owner owner) {
        if ( owner == null ) {
            return null;
        }

        OwnerDTO ownerDTO = new OwnerDTO();

        ownerDTO.setBirthday( owner.getBirthday() );
        ownerDTO.setCareer( owner.getCareer() );
        ownerDTO.setCity( owner.getCity() );
        ownerDTO.setDistrict( owner.getDistrict() );
        ownerDTO.setEmail( owner.getEmail() );
        ownerDTO.setFirstName( owner.getFirstName() );
        ownerDTO.setGender( owner.getGender() );
        ownerDTO.setHouseholdHead( owner.getHouseholdHead() );
        ownerDTO.setIdCardNumber( owner.getIdCardNumber() );
        ownerDTO.setLastName( owner.getLastName() );
        ownerDTO.setMiddleName( owner.getMiddleName() );
        ownerDTO.setOccupancy( owner.getOccupancy() );
        ownerDTO.setOwnerId( owner.getOwnerId() );
        ownerDTO.setPhoneNumber( owner.getPhoneNumber() );
        ownerDTO.setStreet( owner.getStreet() );
        ownerDTO.setWard( owner.getWard() );
        ownerDTO.setCreateDate( owner.getCreateDate() );
        ownerDTO.setHousehold( householdToSimpleHouseholdDTO( owner.getHousehold() ) );
        ownerDTO.setUpdateDate( owner.getUpdateDate() );

        return ownerDTO;
    }

    @Override
    public SimpleOwnerDTO toSimpleDTO(Owner owner) {
        if ( owner == null ) {
            return null;
        }

        SimpleOwnerDTO simpleOwnerDTO = new SimpleOwnerDTO();

        simpleOwnerDTO.setBirthday( owner.getBirthday() );
        simpleOwnerDTO.setCareer( owner.getCareer() );
        simpleOwnerDTO.setCity( owner.getCity() );
        simpleOwnerDTO.setDistrict( owner.getDistrict() );
        simpleOwnerDTO.setEmail( owner.getEmail() );
        simpleOwnerDTO.setFirstName( owner.getFirstName() );
        simpleOwnerDTO.setGender( owner.getGender() );
        simpleOwnerDTO.setHouseholdHead( owner.getHouseholdHead() );
        simpleOwnerDTO.setIdCardNumber( owner.getIdCardNumber() );
        simpleOwnerDTO.setLastName( owner.getLastName() );
        simpleOwnerDTO.setMiddleName( owner.getMiddleName() );
        simpleOwnerDTO.setOccupancy( owner.getOccupancy() );
        simpleOwnerDTO.setOwnerId( owner.getOwnerId() );
        simpleOwnerDTO.setPhoneNumber( owner.getPhoneNumber() );
        simpleOwnerDTO.setStreet( owner.getStreet() );
        simpleOwnerDTO.setWard( owner.getWard() );

        return simpleOwnerDTO;
    }

    @Override
    public ResidentDTO toResident(Owner owner) {
        if ( owner == null ) {
            return null;
        }

        ResidentDTO residentDTO = new ResidentDTO();

        residentDTO.setBirthday( owner.getBirthday() );
        residentDTO.setCareer( owner.getCareer() );
        residentDTO.setCity( owner.getCity() );
        residentDTO.setDistrict( owner.getDistrict() );
        residentDTO.setEmail( owner.getEmail() );
        residentDTO.setFirstName( owner.getFirstName() );
        residentDTO.setGender( owner.getGender() );
        residentDTO.setHouseholdHead( owner.getHouseholdHead() );
        residentDTO.setIdCardNumber( owner.getIdCardNumber() );
        residentDTO.setLastName( owner.getLastName() );
        residentDTO.setMiddleName( owner.getMiddleName() );
        residentDTO.setPhoneNumber( owner.getPhoneNumber() );
        residentDTO.setStreet( owner.getStreet() );
        residentDTO.setWard( owner.getWard() );

        return residentDTO;
    }

    @Override
    public Owner toEntity(AddOwnerDTO ownerDTO) {
        if ( ownerDTO == null ) {
            return null;
        }

        Owner owner = new Owner();

        owner.setBirthday( ownerDTO.getBirthday() );
        owner.setCareer( ownerDTO.getCareer() );
        owner.setCity( ownerDTO.getCity() );
        owner.setDistrict( ownerDTO.getDistrict() );
        owner.setEmail( ownerDTO.getEmail() );
        owner.setFirstName( ownerDTO.getFirstName() );
        owner.setGender( ownerDTO.getGender() );
        owner.setIdCardNumber( ownerDTO.getIdCardNumber() );
        owner.setLastName( ownerDTO.getLastName() );
        owner.setMiddleName( ownerDTO.getMiddleName() );
        owner.setPhoneNumber( ownerDTO.getPhoneNumber() );
        owner.setStreet( ownerDTO.getStreet() );
        owner.setWard( ownerDTO.getWard() );

        return owner;
    }

    @Override
    public Owner toEntity(AddMemberDTO memberDTO) {
        if ( memberDTO == null ) {
            return null;
        }

        Owner owner = new Owner();

        owner.setBirthday( memberDTO.getBirthday() );
        owner.setCareer( memberDTO.getCareer() );
        owner.setCity( memberDTO.getCity() );
        owner.setDistrict( memberDTO.getDistrict() );
        owner.setEmail( memberDTO.getEmail() );
        owner.setFirstName( memberDTO.getFirstName() );
        owner.setGender( memberDTO.getGender() );
        owner.setIdCardNumber( memberDTO.getIdCardNumber() );
        owner.setLastName( memberDTO.getLastName() );
        owner.setMiddleName( memberDTO.getMiddleName() );
        owner.setPhoneNumber( memberDTO.getPhoneNumber() );
        owner.setStreet( memberDTO.getStreet() );
        owner.setWard( memberDTO.getWard() );

        return owner;
    }

    @Override
    public void updateEntity(UpdateOwnerDTO residentDTO, Owner owner) {
        if ( residentDTO == null ) {
            return;
        }

        owner.setOwnerId( residentDTO.getOwnerId() );
        owner.setBirthday( residentDTO.getBirthday() );
        owner.setCareer( residentDTO.getCareer() );
        owner.setCity( residentDTO.getCity() );
        owner.setDistrict( residentDTO.getDistrict() );
        owner.setEmail( residentDTO.getEmail() );
        owner.setFirstName( residentDTO.getFirstName() );
        owner.setGender( residentDTO.getGender() );
        owner.setIdCardNumber( residentDTO.getIdCardNumber() );
        owner.setHouseholdHead( residentDTO.getHouseholdHead() );
        owner.setOccupancy( residentDTO.getOccupancy() );
        owner.setLastName( residentDTO.getLastName() );
        owner.setMiddleName( residentDTO.getMiddleName() );
        owner.setPhoneNumber( residentDTO.getPhoneNumber() );
        owner.setStreet( residentDTO.getStreet() );
        owner.setWard( residentDTO.getWard() );
    }

    protected SimpleHouseholdDTO householdToSimpleHouseholdDTO(Household household) {
        if ( household == null ) {
            return null;
        }

        SimpleHouseholdDTO simpleHouseholdDTO = new SimpleHouseholdDTO();

        simpleHouseholdDTO.setHouseholdId( household.getHouseholdId() );
        simpleHouseholdDTO.setTotalMember( household.getTotalMember() );

        return simpleHouseholdDTO;
    }
}
