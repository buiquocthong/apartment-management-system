package vn.apartment.master.interactor.owner;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.service.ContractService;
import vn.apartment.master.service.HouseholdService;
import vn.apartment.master.service.OwnerService;

@Interactor
public class RemoveOwner {
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private ContractService contractService;
    @Autowired
    private HouseholdService householdService;

    @Transactional
    public void execute(final String residentId) {
        if (ObjectUtils.isEmpty(residentId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }

        Owner hadOwner = ownerService.findOwnerById(residentId);
        if (hadOwner.getHouseholdHead().equals(Boolean.TRUE)){
            throw new InvalidParameterException("Don't remove resident who is head of contract");
        }

        Household hadHousehold = householdService.findHouseholdById(hadOwner.getHousehold().getHouseholdId());
        hadHousehold.setTotalMember(hadHousehold.getTotalMember() - 1);
        householdService.saveOrUpdate(hadHousehold);

        ownerService.delete(residentId);
    }
}
