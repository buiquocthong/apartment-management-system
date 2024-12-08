package vn.apartment.identity.dto.role;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.identity.dto.resource.ResourceDTO;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;


@Schema(name = "Role")
public class RoleDTO extends SimpleRoleDTO {

    @JsonProperty(value = "resources")
    private Set<ResourceDTO> resources = new HashSet<>();

    @JsonProperty(value = "created_at")
    private Date createdAt;

    @JsonProperty(value = "updated_at")
    private Date updatedAt;

    public RoleDTO() {
        super();
    }

    public Set<ResourceDTO> getResources() {
        return resources;
    }

    public void setResources(Set<ResourceDTO> resources) {
        this.resources = resources;
    }

    public Date getCreatedAt() {
        return Dates.clone(createdAt);
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = Dates.clone(createdAt);
    }

    public Date getUpdatedAt() {
        return Dates.clone(updatedAt);
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = Dates.clone(updatedAt);
    }
}
