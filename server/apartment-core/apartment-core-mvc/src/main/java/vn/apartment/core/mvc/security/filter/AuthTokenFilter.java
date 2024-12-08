package vn.apartment.core.mvc.security.filter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import vn.apartment.apartment.core.utils.AuthUtils;
import vn.apartment.core.mvc.security.provider.AuthTokenProvider;

public class AuthTokenFilter extends AbstractAuthenticationProcessingFilter {

    public static final Logger LOG = LoggerFactory.getLogger(AuthTokenFilter.class);

    private AuthTokenProvider authTokenProvider;

    public static class AuthorizationTokenMatcher implements RequestMatcher {

        @Override
        public boolean matches(HttpServletRequest request) {
            return request.getHeader(AuthUtils.AUTHORIZATION_HEADER) != null;
        }
    }

    public AuthTokenFilter() {
        super(new AuthorizationTokenMatcher());
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
        throws AuthenticationException {
        return authTokenProvider.loadAuthToken(request);
    }

    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response,
                                            FilterChain chain, Authentication authResult) throws IOException, ServletException {
        super.successfulAuthentication(request, response, chain, authResult);
        chain.doFilter(request, response);
    }

    public AuthTokenProvider getAuthTokenProvider() {
        return authTokenProvider;
    }

    public void setAuthTokenProvider(AuthTokenProvider authTokenProvider) {
        this.authTokenProvider = authTokenProvider;
    }
}
