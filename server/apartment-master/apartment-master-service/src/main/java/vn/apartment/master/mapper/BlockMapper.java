package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.block.AddBlockDTO;
import vn.apartment.master.dto.block.BlockDTO;
import vn.apartment.master.dto.block.UpdateBlockDTO;
import vn.apartment.master.entity.apartment.Block;

@Mapper(componentModel = "spring")
public interface BlockMapper {
    BlockDTO toDto(Block entity);
    Block toEntity(AddBlockDTO dto);
    void updateEntity(UpdateBlockDTO dto, @MappingTarget Block entity);
}
