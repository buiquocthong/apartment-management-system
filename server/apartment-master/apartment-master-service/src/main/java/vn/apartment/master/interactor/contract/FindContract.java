package vn.apartment.master.interactor.contract;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.contract.ContractDTO;
import vn.apartment.master.mapper.ContractMapper;
import vn.apartment.master.service.ContractService;

@Interactor
public class FindContract {

    @Autowired
    private ContractService contractService;

    @Autowired
    private ContractMapper contractMapper;

    @Transactional(readOnly = true)
    public ContractDTO execute(final String contractId){
        if (ObjectUtils.isEmpty(contractId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        return contractMapper.toDTO(contractService.findContractById(contractId));
    }
}
