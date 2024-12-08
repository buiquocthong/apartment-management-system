package vn.apartment.identity.web.global.auth;

import javax.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.apartment.core.model.commom.Credentials;
import vn.apartment.core.model.exception.AuthException;
import vn.apartment.identity.dto.auth.TokenResult;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.identity.interactor.auth.CreateToken;
import vn.apartment.identity.web.api.IdentityApi;


@RestController
@Tag(name = "Authentication", description = "Authentication API Endpoints")
public class AuthApi extends IdentityApi {

    @Autowired
    private CreateToken createToken;

    @ApiResponses(
        value = {
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "401", description = "Invalid username or password"),
            @ApiResponse(responseCode = "500", description = "Unexpected error")
        }
    )
    @Operation(summary = "Token")
    @PostMapping(value = IdentityAPIs.AUTH_TOKEN_API,
        consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public TokenResult token(@Valid Credentials credentials) {

        TokenResult tokenResult = createToken.execute(credentials);

        if (tokenResult != null && tokenResult.isError()) {
            throw new AuthException(tokenResult.getError());
        }

        return tokenResult;
    }
}
