package vn.apartment.core.mvc.security.encoder;

import org.apache.commons.lang3.RandomStringUtils;

public class IdentityPasswordGenerator implements PasswordGenerator {

    private int length;

    public IdentityPasswordGenerator(int length) {
        setLength(length);
    }

    @Override
    public String generate() {
        return RandomStringUtils
            .randomAlphanumeric(getLength());
    }

    public int getLength() {
        return length;
    }

    public void setLength(int length) {
        this.length = length;
    }
}
