package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.floor.AddFloorDTO;
import vn.apartment.master.dto.floor.FloorDTO;
import vn.apartment.master.dto.floor.UpdateFloorDTO;
import vn.apartment.master.entity.apartment.Floor;

@Mapper(componentModel = "spring")
public interface FloorMapper {
    FloorDTO toDTO(Floor floor);
    Floor toEntity(AddFloorDTO floorDTO);
    void updateEntity(UpdateFloorDTO floorDTO, @MappingTarget Floor floor);
}
