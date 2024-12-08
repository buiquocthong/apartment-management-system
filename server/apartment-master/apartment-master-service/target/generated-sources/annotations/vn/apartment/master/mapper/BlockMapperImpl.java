package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.block.AddBlockDTO;
import vn.apartment.master.dto.block.BlockDTO;
import vn.apartment.master.dto.block.UpdateBlockDTO;
import vn.apartment.master.entity.apartment.Block;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:24+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class BlockMapperImpl implements BlockMapper {

    @Override
    public BlockDTO toDto(Block entity) {
        if ( entity == null ) {
            return null;
        }

        BlockDTO blockDTO = new BlockDTO();

        blockDTO.setBlockId( entity.getBlockId() );
        blockDTO.setCreateDate( entity.getCreateDate() );
        blockDTO.setDescription( entity.getDescription() );
        blockDTO.setName( entity.getName() );
        blockDTO.setTotalApartment( entity.getTotalApartment() );
        blockDTO.setTotalFloor( entity.getTotalFloor() );
        blockDTO.setUpdateDate( entity.getUpdateDate() );

        return blockDTO;
    }

    @Override
    public Block toEntity(AddBlockDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Block block = new Block();

        block.setDescription( dto.getDescription() );
        block.setName( dto.getName() );
        block.setTotalFloor( dto.getTotalFloor() );

        return block;
    }

    @Override
    public void updateEntity(UpdateBlockDTO dto, Block entity) {
        if ( dto == null ) {
            return;
        }

        entity.setBlockId( dto.getBlockId() );
        entity.setDescription( dto.getDescription() );
        entity.setName( dto.getName() );
        entity.setTotalApartment( dto.getTotalApartment() );
        entity.setTotalFloor( dto.getTotalFloor() );
    }
}
