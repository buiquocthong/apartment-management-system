package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.master.dto.servicedetail.AddServiceDetailDTO;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;
import vn.apartment.master.dto.servicedetail.UpdateServiceDetailDTO;
import vn.apartment.master.entity.service.ServiceDetail;

@Mapper(componentModel = "spring", uses = {ServiceMapper.class})
public interface ServiceDetailMapper {
    ServiceDetailDTO toDTO(ServiceDetail serviceDetail);
    ServiceDetail toEntity(AddServiceDetailDTO serviceDetailDTO);
    void updateEntity(UpdateServiceDetailDTO serviceDetailDTO, @MappingTarget ServiceDetail serviceDetail);
}
