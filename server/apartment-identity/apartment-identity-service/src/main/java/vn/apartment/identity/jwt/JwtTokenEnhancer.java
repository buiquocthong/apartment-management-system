package vn.apartment.identity.jwt;


import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.apartment.core.utils.AuthUtils;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.core.model.exception.AuthException;
import vn.apartment.core.mvc.security.domain.AccountInfo;
import vn.apartment.core.mvc.security.domain.Permission;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.entity.UserInfo;
import vn.apartment.identity.props.IdentityProperties;
import vn.apartment.identity.service.KeyService;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtTokenEnhancer {

    @Autowired
    private IdentityProperties identityProperties;
    @Autowired
    private KeyService keyService;

    public String createJwtToken(User user) {
        Date now = Dates.now();
        IdentityProperties.Jwt jwt = identityProperties.getJwt();
        Date expiredAt = new Date(now.getTime() + getExpirationInMin(jwt));

        // Create RSA-signer with the private key
        JWSSigner signer = new RSASSASigner(keyService.getPrivateKey());

        // Prepare JWT with claims set
        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
            .subject(user.getAuth().getUsername())
            .jwtID(user.getUserId())
            .issueTime(now)
            .issuer(jwt.getIssuer())
            .expirationTime(expiredAt)
            .claim(AuthUtils.JWT_EMAIL_CLAIM, user.getUserInfo().getEmail())
            .claim(AuthUtils.JWT_ROLE_CLAIM, user.getRole().getLabel())
            .claim(AuthUtils.JWT_ACCOUNT_INFO_CLAIM, buildAccountInfo(user.getUserInfo()))
            .claim(AuthUtils.JWT_PERMISSIONS_CLAIM, buildPermissionList(user))
            .build();

        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.RS256);
        SignedJWT signedJWT = new SignedJWT(jwsHeader, claimsSet);
        try {
            // Compute the RSA signature
            signedJWT.sign(signer);
        } catch (JOSEException e) {
            throw new AuthException("Failed sinning JWT", e);
        }
        return signedJWT.serialize();
    }

    private AccountInfo buildAccountInfo(UserInfo userInfo) {
        return new AccountInfo()
            .prefixName(userInfo.getPrefix())
            .firstName(userInfo.getFirst())
            .middleName(userInfo.getMiddle())
            .countryCode(userInfo.getCountry());
    }

    private List<Permission> buildPermissionList(User user) {
        return user.getRole().getRoleResources().stream()
            .map((rolePer -> new Permission(rolePer.getResource().getResourceId(), rolePer.getPermissions())
            )).collect(Collectors.toList());
    }

    private Long getExpirationInMin(IdentityProperties.Jwt jwt) {
        return jwt.getExpiredTime() * 60 * 1000; // in min
    }
}
