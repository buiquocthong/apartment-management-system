package vn.apartment.master.interactor.owner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.owner.AddMemberDTO;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.mapper.OwnerMapper;
import vn.apartment.master.service.HouseholdService;
import vn.apartment.master.service.OwnerService;

@Interactor
public class AddOwner {
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private OwnerMapper ownerMapper;
    @Autowired
    private HouseholdService householdService;

    public void execute(AddMemberDTO residentDTO){
        if (residentDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }
        saveNewOwner(residentDTO);
    }

    @Transactional
    public Owner saveNewOwner(AddMemberDTO residentDTO) {

        Household hadHousehold = householdService.findHouseholdById(residentDTO.getHouseholdId());
        hadHousehold.setTotalMember(hadHousehold.getTotalMember() + 1);
        householdService.saveOrUpdate(hadHousehold);

        Owner owner = ownerMapper.toEntity(residentDTO);
        owner.setOwnerId(Generators.uuid());
        owner.setHouseholdHead(false);
        owner.setOccupancy(true);
        owner.setHousehold(hadHousehold);

        return ownerService.saveOrUpdate(owner);
    }
}
