package vn.apartment.master.dto.servicedetail;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Update Service Detail")
public class UpdateServiceDetailDTO {

    @JsonProperty(value = "service_detail_id")
    private String serviceDetailId;

    @JsonProperty(value = "new_value", required = true)
    private double newValue;

    @JsonProperty(value = "amount_of_using", required = true)
    private double amountOfUsing;

    public UpdateServiceDetailDTO() {
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

    public double getAmountOfUsing() {
        return amountOfUsing;
    }

    public void setAmountOfUsing(double amountOfUsing) {
        this.amountOfUsing = amountOfUsing;
    }
}
