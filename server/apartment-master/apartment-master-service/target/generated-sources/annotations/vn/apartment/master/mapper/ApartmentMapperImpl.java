package vn.apartment.master.mapper;

import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.apartment.AddApartmentDTO;
import vn.apartment.master.dto.apartment.ApartmentDTO;
import vn.apartment.master.dto.apartment.SaleInfoDTO;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.dto.apartment.UpdateApartmentDTO;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.apartment.Apartment.SaleInfo;
import vn.apartment.master.entity.service.ServiceDetail;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class ApartmentMapperImpl implements ApartmentMapper {

    @Autowired
    private ServiceDetailMapper serviceDetailMapper;

    @Override
    public ApartmentDTO toDTO(Apartment apartment) {
        if ( apartment == null ) {
            return null;
        }

        ApartmentDTO apartmentDTO = new ApartmentDTO();

        apartmentDTO.setApartmentId( apartment.getApartmentId() );
        apartmentDTO.setArea( apartment.getArea() );
        apartmentDTO.setFurnished( apartment.getFurnished() );
        apartmentDTO.setName( apartment.getName() );
        apartmentDTO.setNumberOfBathroom( apartment.getNumberOfBathroom() );
        apartmentDTO.setNumberOfBedroom( apartment.getNumberOfBedroom() );
        apartmentDTO.setSaleInfo( toDto( apartment.getSaleInfo() ) );
        apartmentDTO.setStatus( apartment.getStatus() );
        apartmentDTO.setCreateDate( apartment.getCreateDate() );
        apartmentDTO.setServiceDetail( serviceDetailListToServiceDetailDTOList( apartment.getServiceDetail() ) );
        apartmentDTO.setUpdateDate( apartment.getUpdateDate() );

        return apartmentDTO;
    }

    @Override
    public SimpleApartmentDTO toSimpleDTO(Apartment apartment) {
        if ( apartment == null ) {
            return null;
        }

        SimpleApartmentDTO simpleApartmentDTO = new SimpleApartmentDTO();

        simpleApartmentDTO.setApartmentId( apartment.getApartmentId() );
        simpleApartmentDTO.setArea( apartment.getArea() );
        simpleApartmentDTO.setFurnished( apartment.getFurnished() );
        simpleApartmentDTO.setName( apartment.getName() );
        simpleApartmentDTO.setNumberOfBathroom( apartment.getNumberOfBathroom() );
        simpleApartmentDTO.setNumberOfBedroom( apartment.getNumberOfBedroom() );
        simpleApartmentDTO.setSaleInfo( toDto( apartment.getSaleInfo() ) );
        simpleApartmentDTO.setStatus( apartment.getStatus() );

        return simpleApartmentDTO;
    }

    @Override
    public Apartment toEntity(AddApartmentDTO apartmentDTO) {
        if ( apartmentDTO == null ) {
            return null;
        }

        Apartment apartment = new Apartment();

        apartment.setArea( apartmentDTO.getArea() );
        apartment.setName( apartmentDTO.getName() );
        apartment.setSaleInfo( toEntity( apartmentDTO.getSaleInfo() ) );
        apartment.setNumberOfBedroom( apartmentDTO.getNumberOfBedroom() );
        apartment.setNumberOfBathroom( apartmentDTO.getNumberOfBathroom() );
        apartment.setStatus( apartmentDTO.getStatus() );
        apartment.setFurnished( apartmentDTO.getFurnished() );

        return apartment;
    }

    @Override
    public void update(UpdateApartmentDTO dto, Apartment apartment) {
        if ( dto == null ) {
            return;
        }

        apartment.setApartmentId( dto.getApartmentId() );
        apartment.setArea( dto.getArea() );
        apartment.setName( dto.getName() );
        apartment.setSaleInfo( toEntity( dto.getSaleInfo() ) );
        apartment.setNumberOfBedroom( dto.getNumberOfBedroom() );
        apartment.setNumberOfBathroom( dto.getNumberOfBathroom() );
        apartment.setStatus( dto.getStatus() );
        apartment.setFurnished( dto.getFurnished() );
    }

    @Override
    public SaleInfoDTO toDto(SaleInfo saleInfo) {
        if ( saleInfo == null ) {
            return null;
        }

        SaleInfoDTO saleInfoDTO = new SaleInfoDTO();

        saleInfoDTO.setPurchasePrice( saleInfo.getPurchasePrice() );
        saleInfoDTO.setSaleDate( saleInfo.getSaleDate() );

        return saleInfoDTO;
    }

    @Override
    public SaleInfo toEntity(SaleInfoDTO saleInfoDTO) {
        if ( saleInfoDTO == null ) {
            return null;
        }

        SaleInfo saleInfo = new SaleInfo();

        saleInfo.setPurchasePrice( saleInfoDTO.getPurchasePrice() );
        saleInfo.setSaleDate( saleInfoDTO.getSaleDate() );

        return saleInfo;
    }

    protected List<ServiceDetailDTO> serviceDetailListToServiceDetailDTOList(List<ServiceDetail> list) {
        if ( list == null ) {
            return null;
        }

        List<ServiceDetailDTO> list1 = new ArrayList<ServiceDetailDTO>( list.size() );
        for ( ServiceDetail serviceDetail : list ) {
            list1.add( serviceDetailMapper.toDTO( serviceDetail ) );
        }

        return list1;
    }
}
