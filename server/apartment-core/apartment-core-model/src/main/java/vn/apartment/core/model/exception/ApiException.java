package vn.apartment.core.model.exception;

import vn.apartment.core.model.error.IError;

import javax.validation.constraints.NotNull;

public class ApiException extends RuntimeException {

    private IError error;

    private Throwable throwable;

    public ApiException(IError error) {
        this(error, null);
    }

    public ApiException(@NotNull IError error, Throwable cause) {
        super(error.getMessage(), cause);
        this.error = error;
        this.throwable = cause;
    }

    public IError getError() {
        return error;
    }

    public void setError(IError error) {
        this.error = error;
    }

    public Throwable getThrowable() {
        return throwable;
    }

    public void setThrowable(Throwable throwable) {
        this.throwable = throwable;
    }
}
