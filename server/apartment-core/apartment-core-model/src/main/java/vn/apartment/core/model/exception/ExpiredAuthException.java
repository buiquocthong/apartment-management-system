package vn.apartment.core.model.exception;

import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.error.ErrorCode;

public class ExpiredAuthException extends ApiException {


    public ExpiredAuthException(String message) {
        super(ApiError.failed(ErrorCode.EXPIRED_TOKEN, message));
    }

    public ExpiredAuthException(String message, Throwable throwable) {
        super(ApiError.failed(ErrorCode.EXPIRED_TOKEN, message), throwable);
    }
}
