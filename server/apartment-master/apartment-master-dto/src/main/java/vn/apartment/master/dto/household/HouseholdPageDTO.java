package vn.apartment.master.dto.household;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Household Page")
public class HouseholdPageDTO extends ApiPage<HouseholdDTO> {
    public HouseholdPageDTO(long total, List<HouseholdDTO> items) {
        super(total, items);
    }

}
