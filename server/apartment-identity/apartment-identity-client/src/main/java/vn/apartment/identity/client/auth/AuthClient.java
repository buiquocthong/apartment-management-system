package vn.apartment.identity.client.auth;


import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestParam;
import vn.apartment.identity.dto.auth.TokenResult;
import vn.apartment.identity.dto.constant.IdentityAPIs;

@FeignClient(name = "authClient", url = "${apartment.identity.url}")
public interface AuthClient {

    @PostMapping(value = IdentityAPIs.AUTH_TOKEN_API,
        consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    TokenResult authenticate(@RequestParam("username") String username,
                             @RequestParam("password") String password);
}
