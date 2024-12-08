package vn.apartment.notification.dto.mail;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

@Schema(name = "Simple Mail Page")
public class SimpleMailPageDTO extends ApiPage<SimpleMailDTO> {
    public SimpleMailPageDTO(long total, List<SimpleMailDTO> items) {
        super(total, items);
    }
}
