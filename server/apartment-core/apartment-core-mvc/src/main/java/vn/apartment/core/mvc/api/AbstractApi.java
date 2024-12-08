package vn.apartment.core.mvc.api;

import org.springframework.beans.factory.annotation.Autowired;
import vn.apartment.core.model.exception.AuthException;
import vn.apartment.core.mvc.security.domain.Account;
import vn.apartment.core.mvc.security.holder.AuthHolder;


public abstract class AbstractApi {

    @Autowired
    private AuthHolder authHolder;

    protected Account getCurrentUser() {
        Account principal = authHolder.getPrincipal();
        if (principal != null) {
            return principal;
        }
        throw new AuthException("Un-authorize");
    }
}
