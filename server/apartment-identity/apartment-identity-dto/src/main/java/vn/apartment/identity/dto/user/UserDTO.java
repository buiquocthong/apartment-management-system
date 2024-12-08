package vn.apartment.identity.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.identity.dto.enums.UserStatus;
import vn.apartment.identity.dto.role.SimpleRoleDTO;

import java.util.Date;


@Schema(name = "User")
public class UserDTO {

    @JsonProperty(value = "user_id")
    private String userId;

    @JsonProperty(value = "username", required = true)
    private String username;

    @JsonProperty(value = "status", required = true)
    private UserStatus status = UserStatus.ACTIVE;

    @JsonProperty(value = "role", required = true)
    private SimpleRoleDTO role;

    @JsonProperty(value = "user_info", required = true)
    private UserInfoDTO userInfo;

    @JsonProperty(value = "created_at")
    private Date createdAt;

    @JsonProperty(value = "updated_at")
    private Date updatedAt;

    public UserDTO() {
        super();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public SimpleRoleDTO getRole() {
        return role;
    }

    public void setRole(SimpleRoleDTO role) {
        this.role = role;
    }

    public UserInfoDTO getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfoDTO userInfo) {
        this.userInfo = userInfo;
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
