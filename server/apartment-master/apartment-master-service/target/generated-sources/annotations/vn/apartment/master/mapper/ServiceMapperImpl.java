package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.service.AddServiceDTO;
import vn.apartment.master.dto.service.ServiceDTO;
import vn.apartment.master.dto.service.UpdateServiceDTO;
import vn.apartment.master.entity.service.Service;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class ServiceMapperImpl implements ServiceMapper {

    @Override
    public ServiceDTO toDTO(Service service) {
        if ( service == null ) {
            return null;
        }

        ServiceDTO serviceDTO = new ServiceDTO();

        serviceDTO.setCreateDate( service.getCreateDate() );
        serviceDTO.setMeteredService( service.getMeteredService() );
        serviceDTO.setName( service.getName() );
        serviceDTO.setPrice( service.getPrice() );
        serviceDTO.setServiceId( service.getServiceId() );
        serviceDTO.setUnit( service.getUnit() );
        serviceDTO.setUpdateDate( service.getUpdateDate() );

        return serviceDTO;
    }

    @Override
    public Service toEntity(AddServiceDTO serviceDTO) {
        if ( serviceDTO == null ) {
            return null;
        }

        Service service = new Service();

        service.setMeteredService( serviceDTO.getMeteredService() );
        service.setName( serviceDTO.getName() );
        service.setPrice( serviceDTO.getPrice() );
        service.setUnit( serviceDTO.getUnit() );

        return service;
    }

    @Override
    public void update(UpdateServiceDTO serviceDTO, Service service) {
        if ( serviceDTO == null ) {
            return;
        }

        service.setServiceId( serviceDTO.getServiceId() );
        service.setMeteredService( serviceDTO.getMeteredService() );
        service.setName( serviceDTO.getName() );
        service.setPrice( serviceDTO.getPrice() );
        service.setUnit( serviceDTO.getUnit() );
    }
}
