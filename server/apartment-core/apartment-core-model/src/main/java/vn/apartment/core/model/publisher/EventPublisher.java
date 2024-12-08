package vn.apartment.core.model.publisher;

public interface EventPublisher<T> {

    void publish(T event);

}
