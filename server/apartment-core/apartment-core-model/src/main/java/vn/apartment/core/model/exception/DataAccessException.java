package vn.apartment.core.model.exception;


import vn.apartment.core.model.error.IError;

public class DataAccessException extends ApiException {

    public DataAccessException(IError error) {
        this(error, null);
    }

    public DataAccessException(IError error, Throwable cause) {
        super(error, cause);
    }
}
