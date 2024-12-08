package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import vn.apartment.master.dto.household.HouseholdDTO;
import vn.apartment.master.dto.household.SimpleHouseholdDTO;
import vn.apartment.master.entity.resident.Household;

@Mapper(componentModel = "spring")
public interface HouseholdMapper {
    HouseholdDTO toDTO(Household household);
}
