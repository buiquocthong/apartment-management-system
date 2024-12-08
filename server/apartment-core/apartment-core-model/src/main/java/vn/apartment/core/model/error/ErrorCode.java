package vn.apartment.core.model.error;

public enum ErrorCode implements IError {

    INTERNAL_FAILED(500, "INTERNAL_SERVER_ERROR", "Unexpected error"),
    UNAUTHORIZED(401, "UNAUTHORIZED", "Unauthorized"),
    EXPIRED_TOKEN(401, "EXPIRED_TOKEN", "Unauthorized"),
    FORBIDDEN(403, "FORBIDDEN", "Forbidden"),
    INVALID_REQ_PARAM(400, "INVALID_REQUEST_PARAMETER", "Invalid Request Parameter"),
    RESOURCE_NOT_FOUND(404, "RESOURCE_NOT_FOUND", "Resource Not Found"),
    RESOURCE_ALREADY_EXISTED(400, "RESOURCE_ALREADY_EXISTED", "Resource Already Existed")
    ;

    private final int status;
    private final String code;
    private final String message;

    ErrorCode(int status, String code, String message) {
        this.status = status;
        this.code = code;
        this.message = message;
    }

    @Override
    public int getStatus() {
        return this.status;
    }

    @Override
    public String getCode() {
        return this.code;
    }

    @Override
    public String getMessage() {
        return this.message;
    }
}
