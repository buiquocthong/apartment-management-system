package vn.apartment.identity.dto.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;


@Schema(name = "User Result")
public class UserResultDTO {

    @JsonProperty("user_id")
    private String userId;

    public UserResultDTO() {
        super();
    }

    public UserResultDTO(String userId) {
        setUserId(userId);
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }
}
