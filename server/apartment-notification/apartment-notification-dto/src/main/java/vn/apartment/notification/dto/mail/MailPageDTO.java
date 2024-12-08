package vn.apartment.notification.dto.mail;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Mail Page")
public class MailPageDTO extends ApiPage<MailDTO> {
    public MailPageDTO(long total, List<MailDTO> items) {super(total, items);}

}
