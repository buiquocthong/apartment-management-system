package vn.apartment.master.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.household.HouseholdDTO;
import vn.apartment.master.dto.owner.SimpleOwnerDTO;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.entity.resident.Owner;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class HouseholdMapperImpl implements HouseholdMapper {

    @Override
    public HouseholdDTO toDTO(Household household) {
        if ( household == null ) {
            return null;
        }

        HouseholdDTO householdDTO = new HouseholdDTO();

        householdDTO.setHouseholdId( household.getHouseholdId() );
        householdDTO.setTotalMember( household.getTotalMember() );
        householdDTO.setCreateDate( household.getCreateDate() );
        householdDTO.setOwners( ownerListToSimpleOwnerDTOList( household.getOwners() ) );
        householdDTO.setUpdateDate( household.getUpdateDate() );

        return householdDTO;
    }

    protected SimpleOwnerDTO ownerToSimpleOwnerDTO(Owner owner) {
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

    protected List<SimpleOwnerDTO> ownerListToSimpleOwnerDTOList(List<Owner> list) {
        if ( list == null ) {
            return null;
        }

        List<SimpleOwnerDTO> list1 = new ArrayList<SimpleOwnerDTO>( list.size() );
        for ( Owner owner : list ) {
            list1.add( ownerToSimpleOwnerDTO( owner ) );
        }

        return list1;
    }
}
