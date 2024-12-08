package vn.apartment.identity.mapper;

import org.mapstruct.Mapper;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.entity.Resource;

@Mapper(componentModel = "spring")
public interface ResourceMapper extends ModelMapper<Resource, ResourceDTO> {

    ResourceDTO toDTO(Resource resource);
}
