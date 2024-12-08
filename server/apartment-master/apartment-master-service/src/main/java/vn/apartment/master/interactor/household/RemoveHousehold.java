package vn.apartment.master.interactor.household;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.service.HouseholdService;

@Interactor
public class RemoveHousehold {
    @Autowired
    private HouseholdService householdService;

    @Transactional
    public void execute(final String householdId) {
        if (ObjectUtils.isEmpty(householdId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        householdService.delete(householdId);
    }
}
