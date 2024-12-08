package vn.apartment.apartment.core.utils;

import java.util.Date;

public final class Dates {

    public static Date clone(Date date) {
        return date != null ? new Date(date.getTime()) : null;
    }

    public static Date now() {
        return new Date();
    }

    public static boolean isExpired(Date expiration) {
        return expiration != null && now().after(expiration);
    }

    private Dates() {

    }
}
