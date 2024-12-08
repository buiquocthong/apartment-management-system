package vn.apartment.master.interactor.household;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.dto.household.HouseholdDTO;
import vn.apartment.master.dto.household.HouseholdPageDTO;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.mapper.HouseholdMapper;
import vn.apartment.master.service.HouseholdService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListHousehold {
    @Autowired
    private HouseholdService householdService;
    @Autowired
    private HouseholdMapper householdMapper;

    @Transactional(readOnly = true)
    public HouseholdPageDTO execute(ApiQuery query) {
        Page<Household> pageResult = householdService.findMatchingHouseholds(query);
        List<HouseholdDTO> dtos = pageResult.get()
                .map(householdMapper::toDTO)
                .collect(Collectors.toList());
        return new HouseholdPageDTO(pageResult.getTotalElements(), dtos);
    }
}
