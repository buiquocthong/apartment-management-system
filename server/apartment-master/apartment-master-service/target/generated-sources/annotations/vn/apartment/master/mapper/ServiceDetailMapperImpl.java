package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.servicedetail.AddServiceDetailDTO;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;
import vn.apartment.master.dto.servicedetail.UpdateServiceDetailDTO;
import vn.apartment.master.entity.service.ServiceDetail;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class ServiceDetailMapperImpl implements ServiceDetailMapper {

    @Autowired
    private ServiceMapper serviceMapper;

    @Override
    public ServiceDetailDTO toDTO(ServiceDetail serviceDetail) {
        if ( serviceDetail == null ) {
            return null;
        }

        ServiceDetailDTO serviceDetailDTO = new ServiceDetailDTO();

        serviceDetailDTO.setAmountOfUsing( serviceDetail.getAmountOfUsing() );
        serviceDetailDTO.setCreateDate( serviceDetail.getCreateDate() );
        serviceDetailDTO.setMoney( serviceDetail.getMoney() );
        serviceDetailDTO.setNewValue( serviceDetail.getNewValue() );
        serviceDetailDTO.setOldValue( serviceDetail.getOldValue() );
        serviceDetailDTO.setService( serviceMapper.toDTO( serviceDetail.getService() ) );
        serviceDetailDTO.setServiceDetailId( serviceDetail.getServiceDetailId() );
        serviceDetailDTO.setUpdateDate( serviceDetail.getUpdateDate() );

        return serviceDetailDTO;
    }

    @Override
    public ServiceDetail toEntity(AddServiceDetailDTO serviceDetailDTO) {
        if ( serviceDetailDTO == null ) {
            return null;
        }

        ServiceDetail serviceDetail = new ServiceDetail();

        serviceDetail.setAmountOfUsing( serviceDetailDTO.getAmountOfUsing() );
        serviceDetail.setNewValue( serviceDetailDTO.getNewValue() );

        return serviceDetail;
    }

    @Override
    public void updateEntity(UpdateServiceDetailDTO serviceDetailDTO, ServiceDetail serviceDetail) {
        if ( serviceDetailDTO == null ) {
            return;
        }

        serviceDetail.setServiceDetailId( serviceDetailDTO.getServiceDetailId() );
        serviceDetail.setAmountOfUsing( serviceDetailDTO.getAmountOfUsing() );
        serviceDetail.setNewValue( serviceDetailDTO.getNewValue() );
    }
}
