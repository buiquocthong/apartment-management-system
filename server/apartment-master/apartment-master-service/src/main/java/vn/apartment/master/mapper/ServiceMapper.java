package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.service.AddServiceDTO;
import vn.apartment.master.dto.service.ServiceDTO;
import vn.apartment.master.dto.service.UpdateServiceDTO;
import vn.apartment.master.entity.service.Service;

@Mapper(componentModel = "spring")
public interface ServiceMapper {
    ServiceDTO toDTO(Service service);
    Service toEntity(AddServiceDTO serviceDTO);
    void update(UpdateServiceDTO serviceDTO, @MappingTarget Service service);
}
