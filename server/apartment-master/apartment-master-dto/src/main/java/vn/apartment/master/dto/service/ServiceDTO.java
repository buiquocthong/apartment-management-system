package vn.apartment.master.dto.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.Date;

@Schema(name = "Service")
public class ServiceDTO {

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

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public ServiceDTO() {
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

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}
