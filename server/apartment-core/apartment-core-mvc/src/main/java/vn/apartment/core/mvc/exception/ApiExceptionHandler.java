package vn.apartment.core.mvc.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import vn.apartment.core.model.api.ApiError;
import vn.apartment.core.model.exception.ApiException;

@ControllerAdvice
public class ApiExceptionHandler {

    public static final Logger LOG = LoggerFactory.getLogger(ApiExceptionHandler.class);

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ResponseEntity<ApiError> handleDefaultError(Exception exception) {
        LOG.error("handleDefaultError(exception)", exception);
        final ApiError apiError = ApiError.failed();
        return ResponseEntity
            .status(apiError.getStatus())
            .body(apiError);
    }

    @ExceptionHandler(ApiException.class)
    @ResponseBody
    public ResponseEntity<ApiError> handleApiException(ApiException exception) {
        LOG.error("handleApiException(exception)", exception);
        ApiError apiError = (ApiError) exception.getError();
        return ResponseEntity
            .status(apiError.getStatus())
            .body(apiError);
    }

}
