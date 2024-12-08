package vn.apartment.identity.mapper;

import java.util.HashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.dto.role.RoleDTO;
import vn.apartment.identity.entity.Resource;
import vn.apartment.identity.entity.Role;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:14+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class RoleMapperImpl implements RoleMapper {

    @Autowired
    private ResourceMapper resourceMapper;

    @Override
    public RoleDTO toDTO(Role entity) {
        if ( entity == null ) {
            return null;
        }

        RoleDTO roleDTO = new RoleDTO();

        roleDTO.setDescription( entity.getDescription() );
        roleDTO.setLabel( entity.getLabel() );
        roleDTO.setRoleId( entity.getRoleId() );
        roleDTO.setCreatedAt( entity.getCreatedAt() );
        roleDTO.setResources( resourceSetToResourceDTOSet( entity.getResources() ) );
        roleDTO.setUpdatedAt( entity.getUpdatedAt() );

        return roleDTO;
    }

    @Override
    public Role toEntity(RoleDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Role role = new Role();

        role.setRoleId( dto.getRoleId() );
        role.setLabel( dto.getLabel() );
        role.setDescription( dto.getDescription() );
        role.setCreatedAt( dto.getCreatedAt() );
        role.setUpdatedAt( dto.getUpdatedAt() );
        if ( role.getResources() != null ) {
            Set<Resource> set = resourceDTOSetToResourceSet( dto.getResources() );
            if ( set != null ) {
                role.getResources().addAll( set );
            }
        }

        return role;
    }

    protected Set<ResourceDTO> resourceSetToResourceDTOSet(Set<Resource> set) {
        if ( set == null ) {
            return null;
        }

        Set<ResourceDTO> set1 = new HashSet<ResourceDTO>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( Resource resource : set ) {
            set1.add( resourceMapper.toDTO( resource ) );
        }

        return set1;
    }

    protected Set<Resource> resourceDTOSetToResourceSet(Set<ResourceDTO> set) {
        if ( set == null ) {
            return null;
        }

        Set<Resource> set1 = new HashSet<Resource>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( ResourceDTO resourceDTO : set ) {
            set1.add( resourceMapper.toEntity( resourceDTO ) );
        }

        return set1;
    }
}
