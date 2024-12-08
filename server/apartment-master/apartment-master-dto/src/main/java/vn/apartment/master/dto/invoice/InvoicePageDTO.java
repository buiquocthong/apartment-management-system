package vn.apartment.master.dto.invoice;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Invoice Page")
public class InvoicePageDTO extends ApiPage<InvoiceDTO> {

    public InvoicePageDTO(long total, List<InvoiceDTO> items) {
        super(total, items);
    }
}
