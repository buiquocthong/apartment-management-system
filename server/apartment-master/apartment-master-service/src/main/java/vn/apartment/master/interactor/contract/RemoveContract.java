package vn.apartment.master.interactor.contract;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Contract;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.ContractService;
import vn.apartment.master.service.OwnerService;

import java.util.List;

@Interactor
public class RemoveContract {
    @Autowired
    private ContractService contractService;
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private ApartmentService apartmentService;

    @Transactional
    public void execute(final String contractId){
        if (ObjectUtils.isEmpty(contractId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        Contract hadContract = contractService.findContractById(contractId);
        Apartment hadApartment = hadContract.getApartment();
        hadApartment.setStatus(ApartmentStatus.AVAILABLE);
        Owner hadHead = ownerService.findOwnerByApartment(hadApartment.getApartmentId());
        List<Owner> hadOwners = ownerService.getOwnerByHousehold(hadHead.getHousehold().getHouseholdId());
        hadOwners.forEach(resident ->
                ownerService.delete(resident.getOwnerId())
        );
        contractService.delete(contractId);
        apartmentService.saveOrUpdate(hadApartment);
    }
}
