package vn.apartment.core.model.error;

public interface IError {

    int getStatus();
    String getCode();
    String getMessage();
}
