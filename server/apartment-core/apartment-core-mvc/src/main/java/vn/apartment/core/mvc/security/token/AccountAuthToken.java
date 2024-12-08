package vn.apartment.core.mvc.security.token;

import com.google.common.collect.Lists;

import org.springframework.security.authentication.AbstractAuthenticationToken;
import vn.apartment.core.mvc.security.domain.Account;


public class AccountAuthToken extends AbstractAuthenticationToken {

    private final Account principal;

    public AccountAuthToken(Account principal) {
        super(Lists.newArrayList(principal.getAuthorities()));
        this.principal = principal;
    }

    @Override
    public Object getCredentials() {
        return null;
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    @Override
    public boolean isAuthenticated() {
        return true;
    }
}
