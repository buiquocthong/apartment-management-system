package vn.apartment.master.dto.servicedetail;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Add Service Detail")
public class AddServiceDetailDTO {

    @JsonProperty(value = "new_value", required = true)
    private double newValue;

    @JsonProperty(value = "amount_of_using", required = true)
    private double amountOfUsing;

    @JsonProperty(value = "apartment_id", required = true)
    private String apartmentId;

    @JsonProperty(value = "service_id", required = true)
    private String serviceId;

    public AddServiceDetailDTO() {
        super();
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

    public String getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(String apartmentId) {
        this.apartmentId = apartmentId;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

}
