package vn.apartment.core.model.exception;

import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.error.ErrorCode;

public class UnPrivilegeAccessException extends ApiException {

    public UnPrivilegeAccessException(String message) {
        super(ApiError.failed(ErrorCode.FORBIDDEN, message));
    }
}
