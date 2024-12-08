package vn.apartment.api.gateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import vn.apartment.api.gateway.filter.AuthTokenGatewayFilterFactory;

@Configuration
@EnableWebFluxSecurity
public class WebFluxSecurityConfig {

    @Autowired
    private AuthTokenGatewayFilterFactory authTokenGatewayFilterFactory;

    @Bean
    SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        http.cors()
            .and()
            .authorizeExchange(exchanges ->
            exchanges.anyExchange().permitAll())
            .logout().logoutUrl("/logout")
        ;
        http.csrf().disable();
        return http.build();
    }
}