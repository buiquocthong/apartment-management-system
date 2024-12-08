package vn.apartment.core.mvc.security.holder;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import vn.apartment.core.mvc.security.domain.Account;


public class AuthHolder {

    public Authentication getAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new AuthenticationException("No provided any authentication instance created!") {
            };
        }
        return authentication;
    }
    public boolean isAuthenticated() {
        return SecurityContextHolder.getContext().getAuthentication() != null;
    }
    public Account getPrincipal() {
        return (Account) getAuthentication().getPrincipal();
    }
}
