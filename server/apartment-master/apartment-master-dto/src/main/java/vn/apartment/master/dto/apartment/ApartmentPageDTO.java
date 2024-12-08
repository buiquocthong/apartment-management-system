package vn.apartment.master.dto.apartment;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;

@Schema(name = "Apartment Page")
public class ApartmentPageDTO extends ApiPage<SimpleApartmentDTO> {
    public ApartmentPageDTO(long total, List<SimpleApartmentDTO> items) {
        super(total, items);
    }
}