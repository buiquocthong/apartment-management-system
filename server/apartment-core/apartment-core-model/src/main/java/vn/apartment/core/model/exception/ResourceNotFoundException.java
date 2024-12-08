package vn.apartment.core.model.exception;

import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.error.ErrorCode;

public class ResourceNotFoundException extends DataAccessException {

    public ResourceNotFoundException(String message) {
        super(ApiError.failed(ErrorCode.RESOURCE_NOT_FOUND, message));
    }
}
