package vn.apartment.identity.interactor.resource;

import org.springframework.beans.factory.annotation.Autowired;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.mapper.ResourceMapper;
import vn.apartment.identity.service.ResourceService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListResource {

    @Autowired
    private ResourceService resourceService;
    @Autowired
    private ResourceMapper resourceMapper;

    public List<ResourceDTO> execute() {

        return resourceService.findAll()
            .stream()
            .map(resourceMapper::toDTO)
            .collect(Collectors.toList());
    }
}
