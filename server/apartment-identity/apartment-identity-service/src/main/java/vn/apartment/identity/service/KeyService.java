package vn.apartment.identity.service;

import java.security.KeyPair;
import java.security.PrivateKey;
import java.security.interfaces.RSAPublicKey;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import vn.apartment.core.mvc.security.factory.KeyStoreKeyFactory;
import vn.apartment.identity.props.IdentityProperties;


@Service
public class KeyService {

    private final KeyPair keyPair;

    @Autowired
    public KeyService(IdentityProperties identityProperties) {
        IdentityProperties.Jwt jwt = identityProperties.getJwt();
        KeyStoreKeyFactory keyStoreKeyFactory = new KeyStoreKeyFactory(jwt.getKeyStore(),
            jwt.getKeyStorePassword().toCharArray());
        this.keyPair = keyStoreKeyFactory.getKeyPair(jwt.getKeyPairAlias(),
            jwt.getKeyPairPassword().toCharArray());
    }

    public PrivateKey getPrivateKey() {
        return this.keyPair.getPrivate();
    }

    public RSAPublicKey getRSAPublicKey() {
        return (RSAPublicKey) keyPair.getPublic();
    }
}
