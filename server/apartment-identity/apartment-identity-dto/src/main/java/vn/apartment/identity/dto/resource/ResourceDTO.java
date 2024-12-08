package vn.apartment.identity.dto.resource;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.HashSet;
import java.util.Set;


@Schema(name = "Resource")
public class ResourceDTO {

    @JsonProperty(value = "resource_id")
    private String resourceId;

    @JsonProperty(value = "name")
    private String name;

    @JsonProperty(value = "permissions")
    private Set<String> permissions = new HashSet<>();

    public ResourceDTO() {
        super();
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }
}
