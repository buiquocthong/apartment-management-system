package vn.apartment.identity.service;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.google.common.collect.Sets;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import org.springframework.util.ObjectUtils;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.identity.dao.ResourceRepo;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.entity.Resource;
import vn.apartment.identity.entity.Role;
import vn.apartment.identity.entity.RoleResource;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepo resourceRepo;

    public List<Resource> findAll() {
        return resourceRepo.findAll();
    }

    public Resource findByResourceId(final String resourceId) {
        Optional<Resource> hadResource = resourceRepo.findByResourceId(resourceId);
        if (!hadResource.isPresent()) {
            throw new ResourceNotFoundException("The resource by " + resourceId + " not found.");
        }
        return hadResource.get();
    }

    public Set<RoleResource> populateRoleResources(@NotNull Role role, Set<ResourceDTO> resources) {

        if (ObjectUtils.isEmpty(resources)) {
            return Sets.newHashSet();
        }

        return resources
            .stream()
            .filter((dto) -> !ObjectUtils.isEmpty(dto.getPermissions()))
            .map(dto -> {

                Resource resource = findByResourceId(dto.getResourceId());
                Set<String> permissions = dto.getPermissions();

                RoleResource roleResource = new RoleResource();
                roleResource.setRole(role);
                roleResource.setResource(resource);
                roleResource.setPermissions(permissions);

                return roleResource;
            }).collect(Collectors.toSet());
    }

}
