package vn.apartment.identity.dto.auth;

import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;


@Schema(name = "Token")
public class TokenResult {

    private int status;

    private String token;

    private String error;

    public TokenResult() {
        super();
    }

    public TokenResult(String token) {
        setStatus(200);
        setToken(token);
    }

    public TokenResult(int status, String error) {
        this.status = status;
        this.error = error;
    }

    @JsonIgnore
    public boolean isError() {
        return error != null && !error.isEmpty();
    }

    @JsonIgnore
    public static TokenResult unauthorized() {
        return new TokenResult(401, "Invalid username or password");
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
