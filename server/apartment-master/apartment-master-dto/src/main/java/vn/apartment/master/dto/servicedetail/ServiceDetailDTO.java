package vn.apartment.master.dto.servicedetail;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.service.ServiceDTO;

import java.math.BigDecimal;
import java.util.Date;

@Schema(name = "Service Detail")
public class ServiceDetailDTO {

    @JsonProperty(value = "service_detail_id")
    private String serviceDetailId;

    @JsonProperty(value = "amount_of_using", required = true)
    private double amountOfUsing;

    @JsonProperty(value = "money", required = true)
    private BigDecimal money;

    @JsonProperty(value = "new_value", required = true)
    private double newValue;

    @JsonProperty(value = "old_value", required = true)
    private double oldValue;

    @JsonProperty(value = "service", required = true)
    private ServiceDTO service;

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public ServiceDetailDTO() {
        super();
    }

    public String getServiceDetailId() {
        return serviceDetailId;
    }

    public void setServiceDetailId(String serviceDetailId) {
        this.serviceDetailId = serviceDetailId;
    }

    public double getNewValue() {
        return newValue;
    }

    public void setNewValue(double newValue) {
        this.newValue = newValue;
    }

    public double getOldValue() {
        return oldValue;
    }

    public void setOldValue(double oldValue) {
        this.oldValue = oldValue;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    public double getAmountOfUsing() {
        return amountOfUsing;
    }

    public void setAmountOfUsing(double amountOfUsing) {
        this.amountOfUsing = amountOfUsing;
    }

    public BigDecimal getMoney() {
        return money;
    }

    public void setMoney(BigDecimal money) {
        this.money = money;
    }

    public ServiceDTO getService() {
        return service;
    }

    public void setService(ServiceDTO service) {
        this.service = service;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }
}

