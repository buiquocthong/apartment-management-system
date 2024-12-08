package vn.apartment.identity.client.auth;

import java.util.Map;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;

import vn.apartment.identity.client.ClientConfiguration;
import vn.apartment.identity.dto.constant.IdentityAPIs;

@FeignClient(name = "keyClient", url = "${apartment.identity.url}",
    configuration = ClientConfiguration.class)
public interface KeyClient {

    @GetMapping(value = IdentityAPIs.KEY_RSA_PUB_API)
    Map<String, Object> rsaPublicKey();
}
