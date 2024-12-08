package vn.apartment.identity.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.hibernate.envers.Audited;
import vn.apartment.core.mvc.entity.BaseEntity;


@Audited
@Entity
@Table(name = "USER_INFO")
public class UserInfo extends BaseEntity {

    @Column(name = "EMAIL", nullable = false, unique = true)
    private String email;

    @Column(name = "FIRST_NAME", nullable = false)
    private String first;

    @Column(name = "LAST_NAME")
    private String last;

    @Column(name = "MIDDLE_NAME")
    private String middle;

    @Column(name = "PREFIX")
    private String prefix;

    @Column(name = "PHONE_NUMBER")
    private String phone;

    @Column(name = "COUNTRY_CODE")
    private String country;

    public UserInfo() {
        super();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirst() {
        return first;
    }

    public void setFirst(String first) {
        this.first = first;
    }

    public String getLast() {
        return last;
    }

    public void setLast(String last) {
        this.last = last;
    }

    public String getMiddle() {
        return middle;
    }

    public void setMiddle(String middle) {
        this.middle = middle;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
}
