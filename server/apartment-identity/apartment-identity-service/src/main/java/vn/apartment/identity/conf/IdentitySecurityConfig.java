package vn.apartment.identity.conf;

import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import vn.apartment.core.mvc.anotation.WebMvcSecurity;
import vn.apartment.core.mvc.configure.WebSecurityConfig;
import vn.apartment.core.mvc.security.encoder.IdentityPasswordGenerator;
import vn.apartment.identity.dto.constant.IdentityAPIs;
import vn.apartment.core.mvc.security.encoder.BCryptPasswordEncoder;

@WebMvcSecurity
public class IdentitySecurityConfig extends WebSecurityConfig {

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
            .antMatchers(IdentityAPIs.AUTH_API + "/**").permitAll();
        super.configure(http);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public IdentityPasswordGenerator passwordGenerator() {
        return new IdentityPasswordGenerator(passwordEncoder().getLength());
    }

}
