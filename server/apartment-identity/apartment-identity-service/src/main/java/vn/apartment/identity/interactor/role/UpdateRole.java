package vn.apartment.identity.interactor.role;

import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.dto.role.RoleDTO;
import vn.apartment.identity.entity.Role;
import vn.apartment.identity.entity.RoleResource;
import vn.apartment.identity.service.ResourceService;
import vn.apartment.identity.service.RoleService;


@Interactor
public class UpdateRole {

    @Autowired
    private RoleService roleService;
    @Autowired
    private ResourceService resourceService;

    @Transactional
    public void execute(RoleDTO roleDTO) {

        Role role = roleService.findByRoleId(roleDTO.getRoleId());

        if (!role.getLabel().equals(roleDTO.getLabel())) {
            roleService.checkExistByLabel(roleDTO.getLabel());
            role.setLabel(roleDTO.getLabel());
        }

        role.setDescription(roleDTO.getDescription());

        updateRoleResources(roleDTO, role);

        roleService.saveOrUpdate(role);
    }

    private void updateRoleResources(RoleDTO roleDTO, Role role) {

        Map<String, ResourceDTO> resourceDTOMap = toResourceMap(roleDTO.getResources());

        // Remove or Update change permission for existing role.
        Iterator<RoleResource> rrIterator = role.getRoleResources().iterator();
        while ((rrIterator.hasNext())) {
            RoleResource rr = rrIterator.next();
            ResourceDTO resourceDTO = resourceDTOMap.get(rr.getResourceId());
            if (resourceDTO == null) {
                rrIterator.remove();
            } else {
                rr.setPermissions(resourceDTO.getPermissions());
            }
        }

        //Add new resource permission.
        Map<String, RoleResource> roleResourceMaps = toRoleResourceMap(role.getRoleResources());
        Set<ResourceDTO> newResources = roleDTO.getResources().stream()
            .filter((resourceDTO -> roleResourceMaps.get(resourceDTO.getResourceId()) == null))
            .collect(Collectors.toSet());
        Set<RoleResource> newRoleResource = resourceService.populateRoleResources(role, newResources);

        role.getRoleResources().addAll(newRoleResource);

    }

    private Map<String, RoleResource> toRoleResourceMap(Set<RoleResource> roleResources) {
        return roleResources.stream()
            .collect(Collectors.toMap(RoleResource::getResourceId, Function.identity()));
    }

    private Map<String, ResourceDTO> toResourceMap(Set<ResourceDTO> resourceDTOS) {
        return resourceDTOS.stream()
            .collect(Collectors.toMap(ResourceDTO::getResourceId, Function.identity()));
    }
}
