package vn.apartment.master.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dao.ContractRepo;
import vn.apartment.master.entity.record.Contract;

import java.util.Optional;

import static vn.apartment.master.dao.spec.ContractQuerySpec.newSpecification;
import static vn.apartment.master.dao.spec.ContractQuerySpec.supportedFields;

@Service
public class ContractService {

    private static final Logger LOG = LoggerFactory.getLogger(ContractService.class);

    @Autowired
    private ContractRepo contractRepo;

    public Contract saveOrUpdate(Contract block) {
        return contractRepo.save(block);
    }

    public void delete(final String contractId){
        Contract hadContract = findContractById(contractId);
        hadContract.setDeleted(true);
    }

    public Contract findContractById(final String contractId){
        Optional<Contract> hadContract = retrieveContractById(contractId);
        if (!hadContract.isPresent()) {
            throw new ResourceNotFoundException("The contract by " + contractId + " not found.");
        }
        return hadContract.get();
    }

    public Contract findContractByResident(final String residentId) {
        Optional<Contract> hadContract = retrieveContractByResidentId(residentId);
        if (!hadContract.isPresent()) {
            throw new ResourceNotFoundException("The contract by " + residentId + " not found.");
        }
        return hadContract.get();
    }

    public Optional<Contract> retrieveContractById(final String contractId) {
        return contractRepo.findByContractId(contractId);
    }

    public Optional<Contract> retrieveContractByResidentId(final String residentId) {
        return contractRepo.findByResidentId(residentId);
    }

    public Page<Contract> findMatchingContracts(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return contractRepo.findAll(newSpecification(apiQuery),
                PageableUtils.of(apiQuery, supportedFields()));
    }
}
