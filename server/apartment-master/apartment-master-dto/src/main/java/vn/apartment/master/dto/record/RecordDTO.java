package vn.apartment.master.dto.record;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.owner.OwnerDTO;
import vn.apartment.master.dto.renter.RenterDTO;

import java.util.Date;
import java.util.List;

@Schema(name = "Record")
public class RecordDTO {

    @JsonProperty(value = "record_id")
    private String recordId;

    @JsonProperty(value = "owner")
    private OwnerDTO owner;

    @JsonProperty(value = "renters")
    private List<RenterDTO> renters;

    @JsonProperty(value = "start_date")
    private Date startDate;

    @JsonProperty(value = "end_date")
    private Date endDate;

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public RecordDTO() {
        super();
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
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

    public List<RenterDTO> getRenters() {
        return renters;
    }

    public void setRenters(List<RenterDTO> renters) {
        this.renters = renters;
    }

    public OwnerDTO getOwner() {
        return owner;
    }

    public void setOwner(OwnerDTO owner) {
        this.owner = owner;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }
}
