package vn.apartment.master.web.api;

import io.swagger.v3.oas.annotations.Parameter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import vn.apartment.core.model.anotation.ApiQueryParams;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.master.dto.constant.MasterAPIs;
import vn.apartment.master.dto.household.HouseholdDTO;
import vn.apartment.master.dto.household.HouseholdPageDTO;
import vn.apartment.master.interactor.household.ListHousehold;

import java.util.List;

@RestController
@RequestMapping(MasterAPIs.HOUSEHOLD_API)
public class HouseholdApi {

    @Autowired
    private ListHousehold listHousehold;

    @ApiQueryParams
    @GetMapping
    @PreAuthorize("@permissionSecurity.hasPrivileges('HOUSEHOLD','VIEW')")
    public HouseholdPageDTO listHouseholds(@Parameter(hidden = true) @ModelAttribute ApiQuery query){
        return listHousehold.execute(query);
    }
}
