package vn.apartment.identity.web.api;

import java.util.Set;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.api.ApiError;
import vn.apartment.identity.dto.auth.ChangePassword;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.identity.dto.resource.ResourceDTO;
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.interactor.auth.AlterPassword;
import vn.apartment.identity.interactor.user.FindUser;
import vn.apartment.identity.interactor.user.FindUserResource;

@RestController
@Tag(name = "Account", description = "Account API Endpoints")
public class AccountApi extends IdentityApi {

    @Autowired
    private FindUser findUser;
    @Autowired
    private FindUserResource findUserResource;
    @Autowired
    private AlterPassword alterPassword;

    @Operation(summary = "My account")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))}
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @GetMapping(IdentityAPIs.MY_ACCOUNT_API)
    public UserDTO findMyAccount() {

        return findUser.execute(getCurrentUser().getId());
    }

    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ResourceDTO.class))}
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @Operation(summary = "My Account Resources")
    @GetMapping(IdentityAPIs.MY_RESOURCE_API)
    public Set<ResourceDTO> findMyResources() {

        return findUserResource.execute(getCurrentUser().getId());
    }

    @PutMapping(IdentityAPIs.CHANGE_PW_API)
    @ResponseStatus(HttpStatus.OK)
    public void changePassword(@RequestBody ChangePassword changePassword) {
        changePassword.setUserId(getCurrentUser().getId());
        alterPassword.execute(changePassword);
    }
}
