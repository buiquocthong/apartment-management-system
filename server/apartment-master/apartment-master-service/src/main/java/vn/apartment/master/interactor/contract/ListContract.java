package vn.apartment.master.interactor.contract;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.contract.ContractDTO;
import vn.apartment.master.dto.contract.ContractPageDTO;
import vn.apartment.master.entity.record.Contract;
import vn.apartment.master.mapper.ContractMapper;
import vn.apartment.master.service.ContractService;


import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListContract {

    @Autowired
    private ContractService contractService;

    @Autowired
    private ContractMapper contractMapper;

    @Transactional(readOnly = true)
    public ContractPageDTO execute(ApiQuery apiQuery) {
        Page<Contract> pageResult = contractService.findMatchingContracts(apiQuery);
        List<ContractDTO> dtos = pageResult.get()
                .map(contractMapper::toDTO)
                .collect(Collectors.toList());
        return new ContractPageDTO(pageResult.getTotalElements(), dtos);
    }
}
