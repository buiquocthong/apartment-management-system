package vn.apartment.identity.dto.auth;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.Email;

@Schema(name = "Reset Password")
public class ResetPassword {

    @JsonProperty(value = "email", required = true)
    @Email
    private String email;

    public ResetPassword() {
    }

    public ResetPassword(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
