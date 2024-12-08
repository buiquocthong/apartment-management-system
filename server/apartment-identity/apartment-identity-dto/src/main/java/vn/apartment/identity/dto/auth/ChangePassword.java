package vn.apartment.identity.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Change Password")
public class ChangePassword {

    @JsonProperty(value = "user_id", required = true)
    private String userId;

    @JsonProperty(value = "old_password", required = true)
    private String oldPassword;

    @JsonProperty(value = "new_password", required = true)
    private String newPassword;

    @JsonProperty(value = "confirm_password", required = true)
    private String confirmPassword;

    public ChangePassword() {
    }

    public ChangePassword(String userId, String oldPassword, String newPassword, String confirmPassword) {
        this.userId = userId;
        this.oldPassword = oldPassword;
        this.newPassword = newPassword;
        this.confirmPassword = confirmPassword;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOldPassword() {
        return oldPassword;
    }

    public void setOldPassword(String oldPassword) {
        this.oldPassword = oldPassword;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
