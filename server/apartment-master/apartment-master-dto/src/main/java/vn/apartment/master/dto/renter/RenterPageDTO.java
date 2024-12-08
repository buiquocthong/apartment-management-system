package vn.apartment.master.dto.renter;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Renter Page")
public class RenterPageDTO extends ApiPage<RenterDTO> {
    public RenterPageDTO(long total, List<RenterDTO> items) {
        super(total, items);
    }
}
