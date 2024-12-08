package vn.apartment.core.mvc.security.provider;

import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;

import com.google.common.collect.Lists;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.ObjectUtils;
import vn.apartment.core.mvc.security.token.AccountAuthToken;

public class CompositeAuthTokenProvider implements AuthTokenProvider {

    private List<AuthTokenProvider> providers;

    public CompositeAuthTokenProvider() {
        this(Lists.newArrayList());
    }

    public CompositeAuthTokenProvider(List<AuthTokenProvider> providers) {
        this.providers = providers;
    }

    public void register(AuthTokenProvider authTokenProvider) {
        providers.add(authTokenProvider);
    }

    @Override
    public AccountAuthToken loadAuthToken(HttpServletRequest request) throws AuthenticationException {

        List<AuthTokenProvider> supports = providers.stream()
            .filter(provider -> provider.support(request))
            .collect(Collectors.toList());

        if (ObjectUtils.isEmpty(supports)) {
            throw new IllegalArgumentException("There are not valid authentication provider.");
        }

        if (supports.size() > 1) {
            throw new IllegalArgumentException("There are multiple valid authentication providers.");
        }

        return supports.get(0).loadAuthToken(request);
    }

    @Override
    public boolean support(HttpServletRequest request) {
        return false;
    }

    public List<AuthTokenProvider> getProviders() {
        return providers;
    }

    public void setProviders(List<AuthTokenProvider> providers) {
        this.providers = providers;
    }
}
