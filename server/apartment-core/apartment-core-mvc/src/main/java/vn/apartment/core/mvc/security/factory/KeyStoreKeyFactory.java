package vn.apartment.core.mvc.security.factory;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyFactory;
import java.security.KeyPair;
import java.security.KeyStore;
import java.security.PublicKey;
import java.security.interfaces.RSAPrivateCrtKey;
import java.security.spec.RSAPublicKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.core.io.Resource;

public class KeyStoreKeyFactory {

    private static final Logger LOG = LoggerFactory.getLogger(KeyStoreKeyFactory.class);

    private Resource resource;

    private char[] password;

    private KeyStore store;

    private Object lock = new Object();

    public KeyStoreKeyFactory(Resource resource, char[] password) {
        this.resource = resource;
        this.password = password;
    }

    public KeyPair getKeyPair(String alias, char[] password) {
        InputStream inputStream = null;
        try {
            synchronized (lock) {
                if (store == null) {
                    synchronized (lock) {
                        store = KeyStore.getInstance("jks");
                        inputStream = resource.getInputStream();
                        store.load(inputStream, this.password);
                    }
                }
            }
            RSAPrivateCrtKey key = (RSAPrivateCrtKey) store.getKey(alias, password);
            RSAPublicKeySpec spec = new RSAPublicKeySpec(key.getModulus(), key.getPublicExponent());
            PublicKey publicKey = KeyFactory.getInstance("RSA").generatePublic(spec);
            return new KeyPair(publicKey, key);
        } catch (Exception e) {
            throw new IllegalStateException("Cannot load keys from store: " + resource, e);
        } finally {
            try {
                if (inputStream != null) {
                    inputStream.close();
                }
            } catch (IOException e) {
                LOG.warn("Cannot close open stream: ", e);
            }
        }
    }
}
