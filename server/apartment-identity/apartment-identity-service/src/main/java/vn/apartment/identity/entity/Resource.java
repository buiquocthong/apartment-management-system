package vn.apartment.identity.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.core.mvc.entity.BaseEntity;


@Entity
@Table(name = "RESOURCE")
public class Resource extends BaseEntity {

    @Column(name = "RESOURCE_ID", nullable = false)
    private String resourceId;

    @Column(name = "NAME", nullable = false)
    private String name;

    @Column(name = "DESCRIPTION")
    private String description;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private Date createdAt;

    private transient Set<String> permissions = new HashSet<>();

    public Resource() {
        super();
    }

    public String getResourceId() {
        return resourceId;
    }

    public void setResourceId(String resourceId) {
        this.resourceId = resourceId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<String> getPermissions() {
        return permissions;
    }

    public void setPermissions(Set<String> permissions) {
        this.permissions = permissions;
    }

    public Date getCreatedAt() {
        return Dates.clone(createdAt);
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = Dates.clone(createdAt);
    }
}
