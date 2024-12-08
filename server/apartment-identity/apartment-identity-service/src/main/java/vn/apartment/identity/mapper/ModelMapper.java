package vn.apartment.identity.mapper;

public interface ModelMapper<E, D> {
    D toDTO(E entity);
    E toEntity(D dto);
}
