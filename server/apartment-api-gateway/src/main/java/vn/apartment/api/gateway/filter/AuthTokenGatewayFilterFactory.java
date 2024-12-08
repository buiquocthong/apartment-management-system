package vn.apartment.api.gateway.filter;

import com.google.common.collect.Sets;
import com.nimbusds.jose.JWSVerifier;
import com.nimbusds.jose.crypto.RSASSAVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import vn.apartment.apartment.core.utils.AuthUtils;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.api.gateway.service.KeyService;
import vn.apartment.core.model.exception.ApiException;
import vn.apartment.core.model.exception.AuthException;
import vn.apartment.core.model.exception.ExpiredAuthException;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import java.util.Set;
import java.util.function.Predicate;

@Component
public class AuthTokenGatewayFilterFactory extends AbstractGatewayFilterFactory<AuthTokenGatewayFilterFactory.Config> {

    private static final String BEARER_TYPE = AuthUtils.BEARER_TYPE;

    public static class Config {

    }

    public static final Set<String> WHITE_API_ENDPOINTS = Sets.newHashSet(
            IdentityAPIs.AUTH_TOKEN_API,
            "/global/"
    );

    public Predicate<ServerHttpRequest> SECURED_API_PREDICATE =
            request -> WHITE_API_ENDPOINTS
                    .stream()
                    .noneMatch(uri -> request.getURI().getPath().contains(uri));

    @Autowired
    private KeyService keyService;

    public AuthTokenGatewayFilterFactory() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {

        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();
            String token = getBearerTokenFromHeader(request);

            if (SECURED_API_PREDICATE.test(request) && !ObjectUtils.isEmpty(token)) {
                this.validateJwtToken(token);
            }

            return chain.filter(exchange);
        };
    }

    private void validateJwtToken(String token) {
        try {

            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new RSASSAVerifier(keyService.geRSAPublicKey());

            if (!signedJWT.verify(verifier)) {
                throw new AuthException("The token not verified.");
            }

            JWTClaimsSet jwtClaimsSet = signedJWT.getJWTClaimsSet();

            if (Dates.isExpired(jwtClaimsSet.getExpirationTime())) {
                throw new ExpiredAuthException("The token has already expired.");
            }

        } catch (Exception ex) {

            if (ex instanceof ApiException) {
                throw (ApiException) ex;
            }

            throw new AuthException("Verify JWT token failed.", ex);
        }
    }

    private String getBearerTokenFromHeader(ServerHttpRequest request) {

        String value = request.getHeaders().getFirst(AuthUtils.AUTHORIZATION_HEADER);

        if (!ObjectUtils.isEmpty(value)
                && value.toLowerCase().startsWith(BEARER_TYPE.toLowerCase())) {

            return value.substring(BEARER_TYPE.length()).trim();
        }

        return null;
    }
}