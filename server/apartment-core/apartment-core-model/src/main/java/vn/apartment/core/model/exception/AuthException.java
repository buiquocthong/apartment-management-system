package vn.apartment.core.model.exception;

import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.error.ErrorCode;

public class AuthException extends ApiException {

    public AuthException(String message) {
        super(ApiError.failed(ErrorCode.UNAUTHORIZED, message));
    }

    public AuthException(String message, Throwable throwable) {
        super(ApiError.failed(ErrorCode.UNAUTHORIZED, message), throwable);
    }
}
