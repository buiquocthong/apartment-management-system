package vn.apartment.identity.interactor.auth;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import vn.apartment.core.model.commom.Credentials;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.core.mvc.security.holder.AuthHolder;
import vn.apartment.identity.dto.auth.TokenResult;
import vn.apartment.identity.dto.enums.UserStatus;
import vn.apartment.identity.entity.Auth;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.jwt.JwtTokenEnhancer;
import vn.apartment.identity.service.UserService;

@Interactor
public class CreateToken {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthHolder authHolder;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenEnhancer tokenEnhancer;

    @Transactional(readOnly = true)
    public TokenResult execute(Credentials credentials) {

        User user = userService.retrieveByUsername(credentials.getUsername())
            .orElse(new User());

        if (ObjectUtils.isEmpty(user.getUserId())
            || isNotActive(user.getStatus())
            || invalidPw(credentials.getPassword(), user.getAuth())) {

            return TokenResult.unauthorized();
        }

        return new TokenResult(tokenEnhancer.createJwtToken(user));
    }

    private boolean isNotActive(UserStatus status) {
        return !UserStatus.ACTIVE.equals(status);
    }

    private boolean invalidPw(String rawPw, Auth auth) {
        return !(auth != null && passwordEncoder.matches(rawPw, auth.getPassword()));
    }
}
