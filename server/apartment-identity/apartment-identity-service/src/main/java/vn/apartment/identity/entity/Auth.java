package vn.apartment.identity.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import org.hibernate.envers.Audited;
import vn.apartment.core.mvc.entity.BaseEntity;

@Audited
@Entity
@Table(name = "AUTH")
public class Auth extends BaseEntity {

    @Column(name = "USERNAME", nullable = false, unique = true)
    private String username;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "PASSWORD_EXPIRED")
    private boolean pwExpired = false;

    public Auth() {
        super();
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isPwExpired() {
        return pwExpired;
    }

    public void setPwExpired(boolean pwExpired) {
        this.pwExpired = pwExpired;
    }
}
