package vn.apartment.master.dto.record;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.renter.AddRenterDTO;

import java.util.Date;

@Schema(name = "Add Record")
public class AddRecordDTO {
    @JsonProperty(value = "owner_id")
    private String ownerId;

    @JsonProperty(value = "renter")
    private AddRenterDTO renter;

    @JsonProperty(value = "start_date")
    private Date startDate;

    @JsonProperty(value = "end_date")
    private Date endDate;

    public AddRecordDTO() {
        super();
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public AddRenterDTO getRenter() {
        return renter;
    }

    public void setRenter(AddRenterDTO renter) {
        this.renter = renter;
    }

    public String getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(String ownerId) {
        this.ownerId = ownerId;
    }
}
