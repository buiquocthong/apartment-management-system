package vn.apartment.master.mapper;

import org.mapstruct.Mapper;

import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.apartment.*;
import vn.apartment.master.entity.apartment.Apartment;

@Mapper(componentModel = "spring", uses = {ServiceDetailMapper.class})
public interface ApartmentMapper {

    ApartmentDTO toDTO(Apartment apartment);
    SimpleApartmentDTO toSimpleDTO(Apartment apartment);
    Apartment toEntity(AddApartmentDTO apartmentDTO);
    void update(UpdateApartmentDTO dto, @MappingTarget Apartment apartment);

    SaleInfoDTO toDto(Apartment.SaleInfo saleInfo);
    Apartment.SaleInfo toEntity(SaleInfoDTO saleInfoDTO);
}
