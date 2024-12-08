package vn.apartment.core.model.exception;

import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.error.ErrorCode;

public class ResourceAlreadyExistedException extends DataAccessException {

    public ResourceAlreadyExistedException(String message) {
        super(ApiError.failed(ErrorCode.RESOURCE_ALREADY_EXISTED, message));
    }
}
