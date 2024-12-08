package vn.apartment.master.mapper;

import org.mapstruct.Mapper;
import vn.apartment.master.dto.contract.AddContractDTO;
import vn.apartment.master.dto.contract.ContractDTO;
import vn.apartment.master.entity.record.Contract;

@Mapper(componentModel = "spring", uses = {OwnerMapper.class})
public interface ContractMapper {
    ContractDTO toDTO(Contract contract);
    Contract toEntity(AddContractDTO contractDTO);
}
