package vn.apartment.master.interactor.owner;

import org.apache.commons.lang3.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.owner.OwnerDTO;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.mapper.ApartmentMapper;
import vn.apartment.master.mapper.OwnerMapper;
import vn.apartment.master.service.ApartmentService;
import vn.apartment.master.service.HouseholdService;
import vn.apartment.master.service.OwnerService;

@Interactor
public class FindOwner {
    @Autowired
    private OwnerService ownerService;
    @Autowired
    private OwnerMapper ownerMapper;
    @Autowired
    private ApartmentService apartmentService;
    @Autowired
    private ApartmentMapper apartmentMapper;
    @Autowired
    private HouseholdService householdService;

    @Transactional(readOnly = true)
    public OwnerDTO execute(final String ownerId) {
        if (ObjectUtils.isEmpty(ownerId)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }
        Household hadHousehold = householdService.findHouseholdByOwner(ownerId);
        Apartment hadApartment = apartmentService.findApartmentByHousehold(hadHousehold.getHouseholdId());
        OwnerDTO hadOwner = ownerMapper.toDTO(ownerService.findOwnerById(ownerId));
        hadOwner.setApartment(apartmentMapper.toSimpleDTO(hadApartment));
        return hadOwner;
    }
}
