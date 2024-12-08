package vn.apartment.notification.dto.template;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;


@Schema(name = "Template Page")
public class TemplatePageDTO extends ApiPage<TemplateDTO> {

    public TemplatePageDTO(long total, List<TemplateDTO> items) {
        super(total, items);
    }
}
