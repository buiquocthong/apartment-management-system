package vn.apartment.identity.dto.constant;


public final class IdentityAPIs {

    public static final String API = "/api";
    public static final String GLOBAL_API = "/global";

    public static final String AUTH_API = GLOBAL_API + "/auth";
    public static final String AUTH_TOKEN_API = AUTH_API + "/token";
    public static final String FORGET_PW_API = GLOBAL_API + "/reset_password";

    public static final String KEY_RSA_PUB_API = API + "/keys/rsa_public";

    public static final String USER_API = API + "/users";

    public static final String MY_ACCOUNT_API = API + "/my/account";
    public static final String MY_RESOURCE_API = API + "/my/resources";
    public static final String CHANGE_PW_API = MY_ACCOUNT_API + "/change_password";

    public static final String ROLE_API = API + "/roles";

    public static final String RESOURCE_API = API + "/resources";


    private IdentityAPIs() {
    }

}
