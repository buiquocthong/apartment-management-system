package vn.apartment.identity.dto.role;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;


@Schema(name = "Role Result")
public class RoleResultDTO {

    @JsonProperty("role_id")
    private String roleId;

    public RoleResultDTO() {
        this(null);
    }

    public RoleResultDTO(String roleId) {
        setRoleId(roleId);
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }
}
