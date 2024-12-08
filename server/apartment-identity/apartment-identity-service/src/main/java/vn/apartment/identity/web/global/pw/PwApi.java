package vn.apartment.identity.web.global.pw;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import vn.apartment.identity.dto.auth.ResetPassword;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.identity.interactor.auth.ForgetPassword;

@RestController
public class PwApi {

    @Autowired
    private ForgetPassword forgetPassword;

    @PutMapping(value = IdentityAPIs.FORGET_PW_API)
    public void resetPassword(@RequestBody ResetPassword email) {
        forgetPassword.execute(email);
    }
}
