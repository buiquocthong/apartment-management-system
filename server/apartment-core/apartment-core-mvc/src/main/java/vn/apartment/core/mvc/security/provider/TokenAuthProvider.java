package vn.apartment.core.mvc.security.provider;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import vn.apartment.core.model.exception.AuthException;
import vn.apartment.core.mvc.security.token.AccountAuthToken;


public class TokenAuthProvider implements AuthenticationProvider {

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (authentication instanceof AccountAuthToken) {
            return authentication;
        }
        throw new AuthException("Bad credentials on given token authentication " + authentication);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return AccountAuthToken.class.equals(authentication);
    }
}
