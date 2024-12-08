package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.owner.*;
import vn.apartment.master.dto.resident.ResidentDTO;
import vn.apartment.master.entity.resident.Owner;

@Mapper(componentModel = "spring")
public interface OwnerMapper {
    OwnerDTO toDTO(Owner owner);
    SimpleOwnerDTO toSimpleDTO(Owner owner);
    ResidentDTO toResident(Owner owner);
    Owner toEntity(AddOwnerDTO ownerDTO);
    Owner toEntity(AddMemberDTO memberDTO);
    void updateEntity(UpdateOwnerDTO residentDTO, @MappingTarget Owner owner);
}
