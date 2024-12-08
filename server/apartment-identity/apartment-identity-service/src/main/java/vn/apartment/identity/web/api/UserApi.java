package vn.apartment.identity.web.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.Parameters;
import io.swagger.v3.oas.annotations.enums.ParameterIn;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import vn.apartment.core.model.anotation.ApiQueryParams;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.dto.user.UserPageDTO;
import vn.apartment.identity.dto.user.UserResultDTO;
import vn.apartment.identity.interactor.user.AddUser;
import vn.apartment.identity.interactor.user.FindUser;
import vn.apartment.identity.interactor.user.ListUser;
import vn.apartment.identity.interactor.user.UpdateUser;


@RestController
@RequestMapping(IdentityAPIs.USER_API)
@Tag(name = "Users", description = "User API Endpoints")
public class UserApi extends IdentityApi {

    @Autowired
    private AddUser addUser;
    @Autowired
    private UpdateUser updateUser;
    @Autowired
    private FindUser findUser;
    @Autowired
    private ListUser listUser;

    @Operation(summary = "Add New User")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Success",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserResultDTO.class))}
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "400", description = "User already existed",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@permissionSecurity.hasUserPrivileges('ADD/UPDATE')")
    @AuditAction("ADD_NEW_USER")
    public UserResultDTO addNewUser(@RequestBody UserDTO userDTO) {
        return addUser.execute(userDTO);
    }

    @Operation(summary = "Update User")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success"),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "404", description = "Not found",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @PutMapping(value = "/{userId}")
    @PreAuthorize("@permissionSecurity.hasUserPrivileges('ADD/UPDATE')")
    @ResponseStatus(HttpStatus.OK)
    public void updateUser(@PathVariable("userId") String userId, @RequestBody UserDTO userDTO) {
        userDTO.setUserId(userId);
        updateUser.execute(userDTO);
    }

    @Operation(summary = "Find by User")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Success",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserDTO.class))}
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "404", description = "Not found",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @GetMapping(value = "/{userId}")
    @PreAuthorize("@permissionSecurity.hasUserPrivileges('VIEW')")
    public UserDTO findUserById(@PathVariable("userId") String userId) {

        return findUser.execute(userId);
    }

    @Operation(summary = "List Users")
    @Parameters(
        @Parameter(name = "sort_by", in = ParameterIn.QUERY,
            schema = @Schema(type = "string", allowableValues = {"username", "updated_at"}, defaultValue = "updated_at")
        )
    )
    @ApiQueryParams
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = UserPageDTO.class))}
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "403", description = "Forbidden",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @GetMapping
    @PreAuthorize("@permissionSecurity.hasUserPrivileges('VIEW')")
    public UserPageDTO listUsers(@Parameter(hidden = true) @ModelAttribute ApiQuery query) {

        return listUser.execute(query);
    }
}
