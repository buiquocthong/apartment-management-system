package vn.apartment.master.dto.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.owner.AddOwnerDTO;

import java.util.Date;

@Schema(name = "Add Contract")
public class AddContractDTO {

    @JsonProperty(value = "start_date", required = true)
    private Date startDate;

    @JsonProperty(value = "end_date", required = true)
    private Date endDate;

    @JsonProperty(value = "status", required = true)
    private ContractStatus status;

    @JsonProperty(value = "apartment_id", required = true)
    private String apartmentId;

    @JsonProperty(value = "owner", required = true)
    private AddOwnerDTO owner;

    public AddContractDTO() {
        super();
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public AddOwnerDTO getOwner() {
        return owner;
    }

    public void setOwner(AddOwnerDTO owner) {
        this.owner = owner;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public ContractStatus getStatus() {
        return status;
    }

    public void setStatus(ContractStatus status) {
        this.status = status;
    }

    public String getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(String apartmentId) {
        this.apartmentId = apartmentId;
    }
}
