package vn.apartment.master.dto.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "Update Service")
public class UpdateServiceDTO {

    @JsonProperty(value = "service_id")
    private String serviceId;

    @JsonProperty(value = "metered_service", required = true)
    private Boolean meteredService;

    @JsonProperty(value = "name", required = true)
    private String name;

    @JsonProperty(value = "price", required = true)
    private BigDecimal price;

    @JsonProperty(value = "unit", required = true)
    private String unit;

    public UpdateServiceDTO() {
        super();
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
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
