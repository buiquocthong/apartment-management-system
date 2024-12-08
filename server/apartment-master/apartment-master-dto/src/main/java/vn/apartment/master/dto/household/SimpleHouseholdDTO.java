package vn.apartment.master.dto.household;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Simple Household")
public class SimpleHouseholdDTO {
    @JsonProperty(value = "household_id")
    private String householdId;

    @JsonProperty(value = "total_member")
    private int totalMember;

    public SimpleHouseholdDTO() {
        super();
    }

    public String getHouseholdId() {
        return householdId;
    }

    public void setHouseholdId(String householdId) {
        this.householdId = householdId;
    }

    public int getTotalMember() {
        return totalMember;
    }

    public void setTotalMember(int totalMember) {
        this.totalMember = totalMember;
    }

}
