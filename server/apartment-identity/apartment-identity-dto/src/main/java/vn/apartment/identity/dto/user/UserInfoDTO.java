package vn.apartment.identity.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import javax.validation.constraints.Email;

@Schema(name = "User Info")
public class UserInfoDTO {

    @JsonProperty(value = "email")
    @Email(message = "Email is not valid")
    private String email;

    @JsonProperty(value = "first")
    private String first;

    @JsonProperty(value = "middle")
    private String middle;

    @JsonProperty(value = "last")
    private String last;

    @JsonProperty(value = "prefix")
    private String prefix;

    @JsonProperty(value = "phone")
    private String phone;

    @JsonProperty(value = "country")
    private String country;

    public UserInfoDTO() {
        super();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirst() {
        return first;
    }

    public void setFirst(String first) {
        this.first = first;
    }

    public String getMiddle() {
        return middle;
    }

    public void setMiddle(String middle) {
        this.middle = middle;
    }

    public String getLast() {
        return last;
    }

    public void setLast(String last) {
        this.last = last;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
