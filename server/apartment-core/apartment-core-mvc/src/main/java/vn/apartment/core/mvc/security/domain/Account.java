package vn.apartment.core.mvc.security.domain;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import com.google.common.collect.Lists;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

public class Account implements UserDetails, Principal {

    private String id;

    private String username;

    private String email;

    private AccountInfo accountInfo;

    private String role;

    private List<Permission> permissions = new ArrayList<>();

    public Account() {
        super();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Lists.newArrayList(new SimpleGrantedAuthority(role.toUpperCase()));
    }

    @Override
    public String getPassword() {
        return null;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String getName() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Account withIdentifier(String identifier) {
        setId(identifier);
        return this;
    }

    public Account withUsername(String loginName) {
        setUsername(loginName);
        return this;
    }

    public Account withRole(String securityRole) {
        setRole(securityRole);
        return this;
    }

    public Account withEmail(String mail) {
        setEmail(mail);
        return this;
    }

    public Account withAccountInfo(AccountInfo details) {
        setAccountInfo(details);
        return this;
    }

    public Account withPermissions(List<Permission> permissions) {
        setPermissions(permissions);
        return this;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public AccountInfo getAccountInfo() {
        return accountInfo;
    }

    public void setAccountInfo(AccountInfo accountInfo) {
        this.accountInfo = accountInfo;
    }

    public List<Permission> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Permission> permissions) {
        this.permissions = permissions;
    }

    public List<Permission> getResources() {
        return permissions;
    }

    public void setResources(List<Permission> permissions) {
        this.permissions = permissions;
    }
}
