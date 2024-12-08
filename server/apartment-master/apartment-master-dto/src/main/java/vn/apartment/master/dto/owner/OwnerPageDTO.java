package vn.apartment.master.dto.owner;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Owner Page")
public class OwnerPageDTO extends ApiPage<SimpleOwnerDTO> {
    public OwnerPageDTO(long total, List<SimpleOwnerDTO> items) {
        super(total, items);
    }
}
