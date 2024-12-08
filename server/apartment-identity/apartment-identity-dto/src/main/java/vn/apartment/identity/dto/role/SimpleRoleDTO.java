package vn.apartment.identity.dto.role;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Simple Role")
public class SimpleRoleDTO {

    @JsonProperty(value = "role_id")
    private String roleId;

    @JsonProperty(value = "label")
    private String label;

    @JsonProperty(value = "description")
    private String description;

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
