package vn.apartment.master.dto.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "Add Service")
public class AddServiceDTO {

    @JsonProperty(value = "metered_service", required = true)
    private Boolean meteredService;

    @JsonProperty(value = "name", required = true)
    private String name;

    @JsonProperty(value = "price", required = true)
    private BigDecimal price;

    @JsonProperty(value = "unit", required = true)
    private String unit;

    public AddServiceDTO() {
        super();
    }

    public Boolean getMeteredService() {
        return meteredService;
    }

    public void setMeteredService(Boolean meteredService) {
        this.meteredService = meteredService;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
