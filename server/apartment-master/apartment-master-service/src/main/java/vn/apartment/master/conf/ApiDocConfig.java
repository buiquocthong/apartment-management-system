package vn.apartment.master.conf;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.security.SecuritySchemes;
import io.swagger.v3.oas.annotations.servers.Server;
import io.swagger.v3.oas.annotations.servers.ServerVariable;
import org.springframework.context.annotation.Configuration;

@OpenAPIDefinition(
        info = @Info(
                title = "Master API Endpoint",
                version = "1"
        ),
        servers = {
                @Server(
                        url = "{schema}://{server}:{port}", description = "API Endpoint",
                        variables = {
                                @ServerVariable(name = "schema", description = "HTTP schema", defaultValue = "http"),
                                @ServerVariable(name = "server", description = "Server Host", defaultValue = "localhost"),
                                @ServerVariable(name = "port", description = "Server Port", defaultValue = "8083"),
                        }
                )
        }
)
@SecuritySchemes({
        @SecurityScheme(
                scheme = "bearer",
                name = "Bearer",
                type = SecuritySchemeType.HTTP,
                in = SecuritySchemeIn.HEADER
        )
})
@Configuration
public class ApiDocConfig {
}
