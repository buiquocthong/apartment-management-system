package vn.apartment.identity.mapper;

import org.mapstruct.Mapper;

import vn.apartment.identity.dto.role.RoleDTO;
import vn.apartment.identity.entity.Role;



@Mapper(componentModel = "spring", uses = {ResourceMapper.class})
public interface RoleMapper extends ModelMapper<Role, RoleDTO> {
}
