package vn.apartment.identity.interactor.role;

import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.role.RoleDTO;
import vn.apartment.identity.dto.role.RoleResultDTO;
import vn.apartment.identity.entity.Role;
import vn.apartment.identity.entity.RoleResource;
import vn.apartment.identity.mapper.RoleMapper;
import vn.apartment.identity.service.ResourceService;
import vn.apartment.identity.service.RoleService;


@Interactor
public class AddRole {

    @Autowired
    private RoleService roleService;
    @Autowired
    private ResourceService resourceService;
    @Autowired
    private RoleMapper roleMapper;

    @Transactional
    public RoleResultDTO execute(RoleDTO roleDTO) {

        roleService.checkExistByLabel(roleDTO.getLabel());
        Role role = roleMapper.toEntity(roleDTO);

        Set<RoleResource> roleResources = getRoleResources(roleDTO, role);
        role.setRoleResources(roleResources);
        role.setRoleId(Generators.uuid());

        roleService.saveOrUpdate(role);

        return new RoleResultDTO(role.getRoleId());
    }

    private Set<RoleResource> getRoleResources(RoleDTO roleDTO, Role role) {

        return resourceService.populateRoleResources(role, roleDTO.getResources());
    }
}
