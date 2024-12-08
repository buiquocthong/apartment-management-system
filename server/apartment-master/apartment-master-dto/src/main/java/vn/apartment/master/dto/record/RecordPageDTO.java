package vn.apartment.master.dto.record;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Record Page")
public class RecordPageDTO extends ApiPage<RecordDTO> {
    public RecordPageDTO(long total, List<RecordDTO> items) {
        super(total, items);
    }
}
