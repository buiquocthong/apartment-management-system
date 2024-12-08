package vn.apartment.api.gateway.service;

import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import com.google.common.cache.LoadingCache;
import com.nimbusds.jose.jwk.RSAKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.apartment.identity.client.auth.KeyClient;
import java.security.interfaces.RSAPublicKey;
import java.util.concurrent.TimeUnit;

@Service
public class KeyService {

    @Autowired
    private KeyClient keyClient;

    private final LoadingCache<String, RSAPublicKey> publicKeyCache = CacheBuilder
        .newBuilder()
        .expireAfterAccess(1, TimeUnit.DAYS)
        .softValues().build(new CacheLoader<String, RSAPublicKey>() {
            @Override
            public RSAPublicKey load(String key) throws Exception {
                return (RSAPublicKey) RSAKey.parse(keyClient.rsaPublicKey()).toPublicKey();
            }
        });

    public RSAPublicKey geRSAPublicKey() {
        return publicKeyCache.getUnchecked("");
    }
}
