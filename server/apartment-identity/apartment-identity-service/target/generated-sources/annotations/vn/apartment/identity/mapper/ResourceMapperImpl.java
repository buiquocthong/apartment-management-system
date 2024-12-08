package vn.apartment.identity.mapper;

import java.util.HashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.entity.Resource;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:13+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class ResourceMapperImpl implements ResourceMapper {

    @Override
    public Resource toEntity(ResourceDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Resource resource = new Resource();

        resource.setResourceId( dto.getResourceId() );
        resource.setName( dto.getName() );
        Set<String> set = dto.getPermissions();
        if ( set != null ) {
            resource.setPermissions( new HashSet<String>( set ) );
        }

        return resource;
    }

    @Override
    public ResourceDTO toDTO(Resource resource) {
        if ( resource == null ) {
            return null;
        }

        ResourceDTO resourceDTO = new ResourceDTO();

        resourceDTO.setName( resource.getName() );
        Set<String> set = resource.getPermissions();
        if ( set != null ) {
            resourceDTO.setPermissions( new HashSet<String>( set ) );
        }
        resourceDTO.setResourceId( resource.getResourceId() );

        return resourceDTO;
    }
}
