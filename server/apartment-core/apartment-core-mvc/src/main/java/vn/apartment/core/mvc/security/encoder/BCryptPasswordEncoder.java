package vn.apartment.core.mvc.security.encoder;

import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

public class BCryptPasswordEncoder implements PasswordEncoder {

    private int length;
    public BCryptPasswordEncoder() {
        this(10);
    }
    public BCryptPasswordEncoder(int length) {
        setLength(length);
    }

    @Override
    public String encode(CharSequence rawPassword) {
        return passwordEncoder().encode(rawPassword);
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return passwordEncoder().matches(rawPassword, encodedPassword);
    }
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder(10);
    }
    public int getLength() {
        return length;
    }
    public void setLength(int length) {
        this.length = length;
    }
}
