package vn.apartment.identity.entity;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Embeddable;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MapsId;
import javax.persistence.Table;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.hibernate.envers.Audited;
import org.hibernate.envers.NotAudited;
import vn.apartment.core.mvc.converter.StringSetConverter;

@Audited
@Entity
@Table(name = "ROLE_RESOURCE")
public class RoleResource {

    @EmbeddedId
    private RoleResourceKey rolePermission = new RoleResourceKey();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ROLE_FK")
    @MapsId("roleId")
    private Role role;

    @NotAudited
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RESOURCE_FK")
    @MapsId("resourceId")
    private Resource resource;

    @Column(name = "PERMISSIONS")
    @Convert(converter = StringSetConverter.class)
    private Set<String> permissions = new HashSet<>();

    public RoleResource() {
        super();
    }

    public String getResourceId() {
        return resource.getResourceId();
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public RoleResourceKey getRolePermission() {
        return rolePermission;
    }

    public void setRolePermission(RoleResourceKey rolePermission) {
        this.rolePermission = rolePermission;
    }

    public Resource getResource() {
        return resource;
    }

    public void setResource(Resource resource) {
        this.resource = resource;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }

    @Embeddable
    public static class RoleResourceKey implements Serializable {

        private Long roleId;
        private Long resourceId;

        public Long getRoleId() {
            return roleId;
        }

        public void setRoleId(Long roleId) {
            this.roleId = roleId;
        }

        public Long getResourceId() {
            return resourceId;
        }

        public void setResourceId(Long resourceId) {
            this.resourceId = resourceId;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o) {
                return true;
            }
            if (o == null || getClass() != o.getClass()) {
                return false;
            }
            RoleResourceKey that = (RoleResourceKey) o;
            return Objects.equals(roleId, that.roleId) && Objects.equals(resourceId, that.resourceId);
        }

        @Override
        public int hashCode() {
            return Objects.hash(roleId, resourceId);
        }
    }

}
