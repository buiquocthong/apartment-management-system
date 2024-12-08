package vn.apartment.core.model.api;

import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.error.ErrorCode;
import vn.apartment.core.model.error.IError;


@Schema(name = "Error Response")
public class ApiError implements IError {

    @JsonProperty(value = "status")
    private int status;

    @JsonProperty(value = "error_code")
    private String code;

    @JsonProperty(value = "error_desc")
    private String message;

    public ApiError() {
        super();
    }

    public ApiError(@NotNull IError error) {
        this(error.getStatus(), error.getCode(), error.getMessage());
    }


    public ApiError(int status, String code, String message) {
        super();
        this.status = status;
        this.code = code;
        this.message = message;
    }

    public static ApiError failed(@NotNull IError error) {
        return new ApiError(error);
    }

    public static ApiError failed(@NotNull IError error, String message) {
        final ApiError apiError = new ApiError(error);
        apiError.setMessage(message);
        return apiError;
    }

    public static ApiError failed() {
        return failed(ErrorCode.INTERNAL_FAILED);
    }

    public void setStatus(int status) {
        this.status = status;
    }

    @Override
    public int getStatus() {
        return status;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String getCode() {
        return code;
    }

    @Override
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
