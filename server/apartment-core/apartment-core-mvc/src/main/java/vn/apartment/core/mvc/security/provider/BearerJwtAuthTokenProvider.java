package vn.apartment.core.mvc.security.provider;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.Enumeration;
import java.util.List;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.util.ObjectUtils;
import vn.apartment.apartment.core.utils.AuthUtils;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.core.mvc.security.domain.Account;
import vn.apartment.core.mvc.security.domain.AccountInfo;
import vn.apartment.core.mvc.security.domain.Permission;
import vn.apartment.core.mvc.security.token.AccountAuthToken;


public class BearerJwtAuthTokenProvider implements AuthTokenProvider {

    private static final String BEARER_TYPE = AuthUtils.BEARER_TYPE;

    private ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public AccountAuthToken loadAuthToken(HttpServletRequest request) throws AuthenticationException {
        final String token = extractHeaderToken(request);

        if (ObjectUtils.isEmpty(token)) {
            throw new InsufficientAuthenticationException("Authorization Bearer {{token}} not provided in headers request.");
        }

        return new AccountAuthToken(createAccount(token));
    }

    @Override
    public boolean support(HttpServletRequest request) {
        return !ObjectUtils.isEmpty(extractHeaderToken(request));
    }

    private Account createAccount(String jwtToken) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(jwtToken);
            JWTClaimsSet claims = signedJWT.getJWTClaimsSet();

            if (Dates.isExpired(claims.getExpirationTime())) {
                throw new BadCredentialsException("The token has expired.");
            }

            Account account = new Account()
                .withIdentifier(claims.getJWTID())
                .withUsername(claims.getSubject())
                .withEmail(claims.getStringClaim(AuthUtils.JWT_EMAIL_CLAIM))
                .withRole(claims.getStringClaim(AuthUtils.JWT_ROLE_CLAIM));
            account.withAccountInfo(getValue(claims, AuthUtils.JWT_ACCOUNT_INFO_CLAIM, AccountInfo.class));
            account.withPermissions(getPermissions(claims, AuthUtils.JWT_PERMISSIONS_CLAIM));
            return account;
        } catch (Exception ex) {
            throw new AuthenticationServiceException("The JWT token is not valid.", ex);
        }
    }

    private <T> T getValue(JWTClaimsSet jwtClaimsSet, String key, Class<T> type) throws ParseException {
        return objectMapper.convertValue(jwtClaimsSet.getJSONObjectClaim(key), type);
    }

    private List<Permission> getPermissions(JWTClaimsSet jwtClaimsSet, String key) throws ParseException {
        return objectMapper.convertValue(jwtClaimsSet.getClaim(key),
            new TypeReference<List<Permission>>() {
            });
    }

    protected String extractHeaderToken(HttpServletRequest request) {
        Enumeration<String> headers = request.getHeaders(AuthUtils.AUTHORIZATION_HEADER);
        while (headers.hasMoreElements()) {
            String value = headers.nextElement();
            if ((value.toLowerCase().startsWith(BEARER_TYPE.toLowerCase()))) {
                String authHeaderValue = value.substring(BEARER_TYPE.length()).trim();
                int commaIndex = authHeaderValue.indexOf(',');
                if (commaIndex > 0) {
                    authHeaderValue = authHeaderValue.substring(0, commaIndex);
                }
                return authHeaderValue;
            }
        }
        return null;
    }
}
