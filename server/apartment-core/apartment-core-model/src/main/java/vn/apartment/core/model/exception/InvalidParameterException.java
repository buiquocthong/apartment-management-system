package vn.apartment.core.model.exception;

import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.error.ErrorCode;

public class InvalidParameterException extends ApiException {

    public InvalidParameterException(String message) {
        super(ApiError.failed(ErrorCode.INVALID_REQ_PARAM, message));
    }
}
