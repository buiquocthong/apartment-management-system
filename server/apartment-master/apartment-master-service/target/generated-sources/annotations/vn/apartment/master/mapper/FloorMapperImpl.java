package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.floor.AddFloorDTO;
import vn.apartment.master.dto.floor.FloorDTO;
import vn.apartment.master.dto.floor.UpdateFloorDTO;
import vn.apartment.master.entity.apartment.Floor;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class FloorMapperImpl implements FloorMapper {

    @Override
    public FloorDTO toDTO(Floor floor) {
        if ( floor == null ) {
            return null;
        }

        FloorDTO floorDTO = new FloorDTO();

        floorDTO.setCreateDate( floor.getCreateDate() );
        floorDTO.setFloorId( floor.getFloorId() );
        floorDTO.setFloorNumber( floor.getFloorNumber() );
        floorDTO.setFloorType( floor.getFloorType() );
        floorDTO.setUpdateDate( floor.getUpdateDate() );

        return floorDTO;
    }

    @Override
    public Floor toEntity(AddFloorDTO floorDTO) {
        if ( floorDTO == null ) {
            return null;
        }

        Floor floor = new Floor();

        floor.setFloorNumber( floorDTO.getFloorNumber() );
        floor.setFloorType( floorDTO.getFloorType() );

        return floor;
    }

    @Override
    public void updateEntity(UpdateFloorDTO floorDTO, Floor floor) {
        if ( floorDTO == null ) {
            return;
        }

        floor.setFloorId( floorDTO.getFloorId() );
        floor.setFloorNumber( floorDTO.getFloorNumber() );
        floor.setFloorType( floorDTO.getFloorType() );
    }
}
