package vn.apartment.master.dto.record;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

@Schema(name = "Update Record")
public class UpdateRecordDTO {

    @JsonProperty(value = "record_id")
    private String recordId;

    @JsonProperty(value = "end_date")
    private Date endDate;

    public UpdateRecordDTO() {
        super();
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }
}
