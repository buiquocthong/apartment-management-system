package vn.apartment.identity.client;

import com.google.common.collect.Sets;
import feign.RequestInterceptor;
import feign.RequestTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import vn.apartment.apartment.core.utils.AuthUtils;
import vn.apartment.identity.client.auth.AuthClient;
import vn.apartment.identity.dto.auth.TokenResult;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import java.util.Set;
import java.util.function.Predicate;

public class ClientConfiguration {
    @Autowired
    @Lazy
    private AuthClient authClient;

    @Value("${apartment.client.username}")
    private String username;
    @Value("${apartment.client.password}")
    private String password;

    private static final Set<String> WHITE_API_ENDPOINTS = Sets.newHashSet(
            IdentityAPIs.AUTH_TOKEN_API,
            "/global/"
    );

    private Predicate<RequestTemplate> SECURED_API =
            request -> WHITE_API_ENDPOINTS
                    .stream()
                    .noneMatch(uri -> request.path().contains(uri));

    public ClientConfiguration() {
        super();
    }

    @Bean
    public RequestInterceptor requestInterceptor() {
        return template -> {
            if (SECURED_API.test(template)) {
                TokenResult tokenResult = authClient.authenticate(username, password);
                template.header(AuthUtils.AUTHORIZATION_HEADER,
                        AuthUtils.BEARER_TYPE + " " + tokenResult.getToken());
            }
        };
    }

}
