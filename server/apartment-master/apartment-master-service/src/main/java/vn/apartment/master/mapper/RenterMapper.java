package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.renter.AddRenterDTO;
import vn.apartment.master.dto.renter.RenterDTO;
import vn.apartment.master.dto.renter.UpdateRenterDTO;
import vn.apartment.master.dto.resident.ResidentDTO;
import vn.apartment.master.entity.resident.Renter;

@Mapper(componentModel = "spring")
public interface RenterMapper {
    RenterDTO toDTO(Renter renter);
    Renter toEntity(AddRenterDTO renterDTO);
    ResidentDTO toResident(Renter renter);
    void update(UpdateRenterDTO addRenterDTO, @MappingTarget Renter renter);
}
