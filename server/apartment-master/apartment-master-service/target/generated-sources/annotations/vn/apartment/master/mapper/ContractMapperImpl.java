package vn.apartment.master.mapper;

import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.master.dto.apartment.SaleInfoDTO;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.dto.contract.AddContractDTO;
import vn.apartment.master.dto.contract.ContractDTO;
import vn.apartment.master.dto.owner.AddOwnerDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.apartment.Apartment.SaleInfo;
import vn.apartment.master.entity.record.Contract;
import vn.apartment.master.entity.resident.Owner;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:25+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class ContractMapperImpl implements ContractMapper {

    @Autowired
    private OwnerMapper ownerMapper;

    @Override
    public ContractDTO toDTO(Contract contract) {
        if ( contract == null ) {
            return null;
        }

        ContractDTO contractDTO = new ContractDTO();

        contractDTO.setApartment( apartmentToSimpleApartmentDTO( contract.getApartment() ) );
        contractDTO.setContractId( contract.getContractId() );
        contractDTO.setCreateDate( contract.getCreateDate() );
        contractDTO.setEndDate( contract.getEndDate() );
        contractDTO.setOwner( ownerToAddOwnerDTO( contract.getOwner() ) );
        contractDTO.setStartDate( contract.getStartDate() );
        contractDTO.setStatus( contract.getStatus() );
        contractDTO.setUpdateDate( contract.getUpdateDate() );

        return contractDTO;
    }

    @Override
    public Contract toEntity(AddContractDTO contractDTO) {
        if ( contractDTO == null ) {
            return null;
        }

        Contract contract = new Contract();

        contract.setStartDate( contractDTO.getStartDate() );
        contract.setStatus( contractDTO.getStatus() );
        contract.setEndDate( contractDTO.getEndDate() );
        contract.setOwner( ownerMapper.toEntity( contractDTO.getOwner() ) );

        return contract;
    }

    protected SaleInfoDTO saleInfoToSaleInfoDTO(SaleInfo saleInfo) {
        if ( saleInfo == null ) {
            return null;
        }

        SaleInfoDTO saleInfoDTO = new SaleInfoDTO();

        saleInfoDTO.setPurchasePrice( saleInfo.getPurchasePrice() );
        saleInfoDTO.setSaleDate( saleInfo.getSaleDate() );

        return saleInfoDTO;
    }

    protected SimpleApartmentDTO apartmentToSimpleApartmentDTO(Apartment apartment) {
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
        simpleApartmentDTO.setSaleInfo( saleInfoToSaleInfoDTO( apartment.getSaleInfo() ) );
        simpleApartmentDTO.setStatus( apartment.getStatus() );

        return simpleApartmentDTO;
    }

    protected AddOwnerDTO ownerToAddOwnerDTO(Owner owner) {
        if ( owner == null ) {
            return null;
        }

        AddOwnerDTO addOwnerDTO = new AddOwnerDTO();

        addOwnerDTO.setBirthday( owner.getBirthday() );
        addOwnerDTO.setCareer( owner.getCareer() );
        addOwnerDTO.setCity( owner.getCity() );
        addOwnerDTO.setDistrict( owner.getDistrict() );
        addOwnerDTO.setEmail( owner.getEmail() );
        addOwnerDTO.setFirstName( owner.getFirstName() );
        addOwnerDTO.setGender( owner.getGender() );
        addOwnerDTO.setIdCardNumber( owner.getIdCardNumber() );
        addOwnerDTO.setLastName( owner.getLastName() );
        addOwnerDTO.setMiddleName( owner.getMiddleName() );
        addOwnerDTO.setPhoneNumber( owner.getPhoneNumber() );
        addOwnerDTO.setStreet( owner.getStreet() );
        addOwnerDTO.setWard( owner.getWard() );

        return addOwnerDTO;
    }
}
