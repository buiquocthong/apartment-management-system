package vn.apartment.identity.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.envers.Audited;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.identity.dto.enums.UserStatus;



@Audited
@Entity
@Table(name = "USER")
public class User extends BaseEntity {

    @Column(name = "USER_ID", updatable = false, unique = true)
    private String userId;

    @Column(name = "STATUS")
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @OneToOne
    @JoinColumn(name = "ROLE_FK", referencedColumnName = "ID")
    private Role role;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "AUTH_FK", referencedColumnName = "ID")
    private Auth auth;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "USER_INFO_FK", referencedColumnName = "ID")
    private UserInfo userInfo;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_AT")
    @CreationTimestamp
    private Date createdAt;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UPDATED_AT")
    @UpdateTimestamp
    private Date updatedAt;

    public User() {
        super();
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Auth getAuth() {
        return auth;
    }

    public void setAuth(Auth auth) {
        this.auth = auth;
    }

    public UserInfo getUserInfo() {
        return userInfo;
    }

    public void setUserInfo(UserInfo userInfo) {
        this.userInfo = userInfo;
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
