package vn.apartment.core.mvc.security.core;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.util.ObjectUtils;

import vn.apartment.core.model.exception.UnPrivilegeAccessException;
import vn.apartment.core.mvc.security.domain.Permission;
import vn.apartment.core.mvc.security.holder.AuthHolder;


public class PermissionSecurity {

    private static final String ALL_PRIVILEGES = "*";
    private static final String USER_RESOURCE = "USER";
    private static final String ROLE_RESOURCE = "ROLE";

    public PermissionSecurity(AuthHolder authHolder) {
        this.authHolder = authHolder;
    }

    private final AuthHolder authHolder;

    public boolean hasUserPrivileges(String... privileges) {
        return hasPrivileges(USER_RESOURCE, privileges);
    }

    public boolean hasRolePrivileges(String... privileges) {
        return hasPrivileges(ROLE_RESOURCE, privileges);
    }

    public boolean hasPrivileges(final String resourceId, String... privileges) {
        if (ObjectUtils.isEmpty(resourceId) || ObjectUtils.isEmpty(privileges)) {
            throw new IllegalArgumentException("Missing required parameters.");
        }
        Permission permission = getPermissionAsMap().get(resourceId);
        if (permission != null) {
            for (String privilege : privileges) {
                if (permission.getPrivileges().contains(privilege)
                    || permission.getPrivileges().contains(ALL_PRIVILEGES)) {
                    return true;
                }
            }
        }
        throw new UnPrivilegeAccessException("None privilege to access the resource");
    }

    private Map<String, Permission> getPermissionAsMap() {
        return authHolder.getPrincipal()
            .getPermissions()
            .stream()
            .collect(Collectors.toMap(Permission::getId, Function.identity()));
    }
}
