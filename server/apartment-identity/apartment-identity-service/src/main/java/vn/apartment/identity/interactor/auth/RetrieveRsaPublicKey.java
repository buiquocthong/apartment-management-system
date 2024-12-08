package vn.apartment.identity.interactor.auth;

import java.util.Map;

import com.nimbusds.jose.jwk.RSAKey;

import org.springframework.beans.factory.annotation.Autowired;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.service.KeyService;

@Interactor
public class RetrieveRsaPublicKey {

    @Autowired
    private KeyService keyService;

    public Map<String, Object> execute() {
        return new RSAKey.Builder(keyService.getRSAPublicKey())
            .build().toJSONObject();
    }
}
