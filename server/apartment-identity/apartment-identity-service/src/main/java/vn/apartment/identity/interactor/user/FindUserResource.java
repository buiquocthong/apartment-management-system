package vn.apartment.identity.interactor.user;

import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dao.ResourceRepo;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.entity.RoleResource;

@Interactor
public class FindUserResource {

    @Autowired
    private ResourceRepo resourceRepo;

    public Set<ResourceDTO> execute(String userId) {

        return resourceRepo.findUserResources(userId)
            .stream()
            .map(FindUserResource::toDTO)
            .collect(Collectors.toSet());
    }

    private static ResourceDTO toDTO(RoleResource roleResource) {
        ResourceDTO dto = new ResourceDTO();
        dto.setResourceId(roleResource.getResource().getResourceId());
        dto.setName(roleResource.getResource().getName());
        dto.setPermissions(roleResource.getPermissions());
        return dto;
    }

}
