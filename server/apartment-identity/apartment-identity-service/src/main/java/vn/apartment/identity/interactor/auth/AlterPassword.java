package vn.apartment.identity.interactor.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.auth.ChangePassword;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.mapper.UserMapper;
import vn.apartment.identity.service.UserService;

@Interactor
public class AlterPassword {

    private static final Logger LOG = LoggerFactory.getLogger(AlterPassword.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public void execute(ChangePassword changePassword) {

        User hadUser = userService.findByUserIdWithAuth(changePassword.getUserId());

        if (passwordEncoder.matches(changePassword.getOldPassword(), hadUser.getAuth().getPassword())){
            if (changePassword.getNewPassword().equals(changePassword.getConfirmPassword())){
                hadUser.getAuth().setPassword(passwordEncoder.encode(changePassword.getConfirmPassword()));
            } else {
                throw new InvalidParameterException("Confirm password does not match");
            }
        } else {
            throw new InvalidParameterException("Old password does not match");
        }
        userService.saveOrUpdate(hadUser);
    }
}
