package vn.apartment.master.interactor.contract;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.model.exception.ResourceAlreadyExistedException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.dto.contract.AddContractDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Contract;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.mapper.ContractMapper;
import vn.apartment.master.mapper.OwnerMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.ContractService;
import vn.apartment.master.service.HouseholdService;

import java.time.Instant;
import java.util.Date;

@Interactor
public class AddContract {

    @Autowired
    private ContractService contractService;
    @Autowired
    private ContractMapper contractMapper;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private OwnerMapper ownerMapper;
    @Autowired
    private HouseholdService householdService;

    @Transactional
    public void execute(AddContractDTO addContractDTO) {
        if (addContractDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }
        saveNewContract(addContractDTO);
    }

    @Transactional
    public Contract saveNewContract(AddContractDTO contractDTO) {

        Apartment hadApartment = apartmentService.findApartmentById(contractDTO.getApartmentId());
        if (hadApartment.getStatus() == ApartmentStatus.SOLD) {
            throw new ResourceAlreadyExistedException("Apartment had contract.");
        }
        hadApartment.setStatus(ApartmentStatus.SOLD);
        hadApartment.getSaleInfo().setSaleDate(Date.from(Instant.now()));

        Household newHousehold = new Household();
        newHousehold.setHouseholdId(Generators.uuid());
        newHousehold.setTotalMember(1);
        householdService.saveOrUpdate(newHousehold);

        Owner newOwner = ownerMapper.toEntity(contractDTO.getOwner());
        newOwner.setOwnerId(Generators.uuid());
        newOwner.setHouseholdHead(true);
        newOwner.setOccupancy(true);
        newOwner.setHousehold(newHousehold);

        Contract newContract = contractMapper.toEntity(contractDTO);
        newContract.setContractId(Generators.uuid());
        newContract.setApartment(hadApartment);
        newContract.setResident(newOwner);

        return contractService.saveOrUpdate(newContract);
    }
}
