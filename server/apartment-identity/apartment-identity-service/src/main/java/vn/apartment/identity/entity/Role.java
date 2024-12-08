package vn.apartment.identity.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.Set;
import java.util.stream.Collectors;
import com.google.common.collect.Sets;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.envers.Audited;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.core.mvc.entity.BaseEntity;


@Audited
@Entity
@Table(name = "ROLE")
public class Role extends BaseEntity {

    @Column(name = "ROLE_ID", nullable = false, unique = true, updatable = false)
    private String roleId;

    @Column(name = "LABEL", nullable = false, unique = true)
    private String label;

    @Column(name = "DESCRIPTION")
    private String description;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "role", orphanRemoval = true)
    private Set<RoleResource> roleResources = Sets.newHashSet();

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UPDATED_AT")
    @UpdateTimestamp
    private Date updatedAt;

    public Role() {
        super();
    }

    public Set<Resource> getResources() {
        return roleResources.stream()
            .map((roleResource) -> {
                Resource resource = new Resource();
                resource.setResourceId(roleResource.getResource().getResourceId());
                resource.setName(roleResource.getResource().getName());
                resource.setPermissions(roleResource.getPermissions());
                return resource;
            }).collect(Collectors.toSet());
    }

    public String getRoleId() {
        return roleId;
    }

    public void setRoleId(String roleId) {
        this.roleId = roleId;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<RoleResource> getRoleResources() {
        return roleResources;
    }

    public void setRoleResources(Set<RoleResource> roleResources) {
        this.roleResources = roleResources;
    }

    public Date getCreatedAt() {
        return Dates.clone(createdAt);
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = Dates.clone(createdAt);
    }

    public Date getUpdatedAt() {
        return Dates.clone(updatedAt);
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = Dates.clone(updatedAt);
    }
}
