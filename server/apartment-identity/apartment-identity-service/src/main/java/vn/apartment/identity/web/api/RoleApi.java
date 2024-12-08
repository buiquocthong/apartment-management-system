package vn.apartment.identity.web.api;

import javax.validation.Valid;
import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.api.ApiError;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.identity.dto.role.RoleDTO;
import vn.apartment.identity.dto.role.RoleResultDTO;
import vn.apartment.identity.interactor.role.AddRole;
import vn.apartment.identity.interactor.role.ListRole;
import vn.apartment.identity.interactor.role.UpdateRole;


@RestController
@RequestMapping(IdentityAPIs.ROLE_API)
@Tag(name = "Roles", description = "Role API Endpoints")
public class RoleApi extends IdentityApi {

    @Autowired
    private ListRole listRole;

    @Autowired
    private AddRole addRoleAct;

    @Autowired
    private UpdateRole updateRole;

    @Operation(summary = "Add Role")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Success",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = RoleResultDTO.class))}
        ),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "400", description = "Role already existed",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("@permissionSecurity.hasRolePrivileges('ADD/UPDATE')")
    @AuditAction("ADD_ROLE")
    public RoleResultDTO addNewRole(@RequestBody @Valid RoleDTO roleDTO) {

        return addRoleAct.execute(roleDTO);
    }

    @Operation(summary = "Update Role")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Success"),
        @ApiResponse(responseCode = "401", description = "Unauthorized",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "400", description = "Role already existed",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "404", description = "Not found",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        ),
        @ApiResponse(responseCode = "500", description = "Unexpected Error",
            content = {@Content(mediaType = "application/json", schema = @Schema(implementation = ApiError.class))}
        )
    })
    @PutMapping("/{roleId}")
    @PreAuthorize("@permissionSecurity.hasRolePrivileges('ADD/UPDATE')")
    @AuditAction("UPDATE_ROLE")
    public void updateRole(@PathVariable("roleId") String roleId,
                                    @RequestBody @Valid RoleDTO roleDTO) {
        roleDTO.setRoleId(roleId);
        updateRole.execute(roleDTO);
    }

    @GetMapping
    @PreAuthorize("@permissionSecurity.hasRolePrivileges('VIEW')")
    public List<RoleDTO> listRoles() {

        return listRole.execute();
    }

}
