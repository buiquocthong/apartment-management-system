package vn.apartment.core.mvc.configure;

import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import vn.apartment.core.mvc.security.core.PermissionSecurity;
import vn.apartment.core.mvc.security.entrypoint.ApartmentAuthenticationEntryPoint;
import vn.apartment.core.mvc.security.filter.AuditFilter;
import vn.apartment.core.mvc.security.filter.AuthTokenFilter;
import vn.apartment.core.mvc.security.handler.AuthStubSuccessHandler;
import vn.apartment.core.mvc.security.holder.AuthHolder;
import vn.apartment.core.mvc.security.provider.AuthTokenProvider;
import vn.apartment.core.mvc.security.provider.BearerJwtAuthTokenProvider;
import vn.apartment.core.mvc.security.provider.TokenAuthProvider;

public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final String[] WHITELISTS_URIS = {
        "/global/**", // Global Public API
        "/docs/**", // Spring OPEN API
        "/actuator/**", // Monitor Actuator
        "/api/invoices/approved/**" //Paypal
    };

    @Override
    protected void configure(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(authenticationProvider());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .cors().disable()
            .csrf().disable()
            .httpBasic()
            .and()
            .authorizeRequests()
            .antMatchers(WHITELISTS_URIS).permitAll()
            .anyRequest().authenticated()
            .and()
            .addFilterBefore(authTokenFilter(), UsernamePasswordAuthenticationFilter.class)
            .addFilterAfter(auditFilter(), AuthTokenFilter.class)
            .exceptionHandling().authenticationEntryPoint(apartmentAuthenticationEntryPoint());
    }

    @Bean
    public AuthTokenFilter authTokenFilter() throws Exception {
        AuthTokenFilter authTokenFilter = new AuthTokenFilter();
        authTokenFilter.setAuthenticationSuccessHandler(new AuthStubSuccessHandler());
        authTokenFilter.setAuthenticationManager(authenticationManagerBean());
        authTokenFilter.setAuthTokenProvider(authTokenProvider());
        return authTokenFilter;
    }

    @Bean
    public AuditFilter auditFilter() {
        return new AuditFilter(authHolder());
    }

    @Bean
    public AuthHolder authHolder() {
        return new AuthHolder();
    }

    @Bean
    public PermissionSecurity permissionSecurity() {
        return new PermissionSecurity(authHolder());
    }

    @Bean
    public AuthTokenProvider authTokenProvider() {
        return new BearerJwtAuthTokenProvider();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        return new TokenAuthProvider();
    }

    @Bean
    public AuthenticationEntryPoint apartmentAuthenticationEntryPoint() {
        return new ApartmentAuthenticationEntryPoint();
    }
}
