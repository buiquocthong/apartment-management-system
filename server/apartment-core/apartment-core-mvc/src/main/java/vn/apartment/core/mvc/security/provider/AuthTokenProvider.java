package vn.apartment.core.mvc.security.provider;

import javax.servlet.http.HttpServletRequest;

import org.springframework.security.core.AuthenticationException;
import vn.apartment.core.mvc.security.token.AccountAuthToken;


public interface AuthTokenProvider {

    AccountAuthToken loadAuthToken(HttpServletRequest request) throws AuthenticationException;

    boolean support(HttpServletRequest request);
}
