package vn.apartment.identity.web.api;

import java.util.List;

import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.interactor.resource.ListResource;


@RestController
@RequestMapping(IdentityAPIs.RESOURCE_API)
@Tag(name = "Resources", description = "Resources API Endpoints")
public class ResourceApi {

    @Autowired
    private ListResource listResource;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMINISTRATOR')")
    public List<ResourceDTO> listResources() {

        return listResource.execute();
    }
}
