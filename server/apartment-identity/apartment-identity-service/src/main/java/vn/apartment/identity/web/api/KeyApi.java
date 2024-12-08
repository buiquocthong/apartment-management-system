package vn.apartment.identity.web.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.identity.interactor.auth.RetrieveRsaPublicKey;

import java.util.Map;

@RestController
@Tag(name = "Key", description = "Key API Endpoints")
public class KeyApi {

    @Autowired
    private RetrieveRsaPublicKey retrieveRsaPublicKey;

    @ApiResponses(
        value = {
            @ApiResponse(responseCode = "200", description = "Success"),
            @ApiResponse(responseCode = "500", description = "Unexpected error")
        }
    )
    @Operation(summary = "RSA Public Key")
    @GetMapping(value = IdentityAPIs.KEY_RSA_PUB_API)
    public Map<String, Object> getRSAPublic() {
        return retrieveRsaPublicKey.execute();
    }

}
