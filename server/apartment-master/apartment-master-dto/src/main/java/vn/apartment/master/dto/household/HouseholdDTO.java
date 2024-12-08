package vn.apartment.master.dto.household;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.owner.SimpleOwnerDTO;

import java.util.Date;
import java.util.List;

@Schema(name = "Household")
public class HouseholdDTO extends SimpleHouseholdDTO{

    @JsonProperty(value = "owners")
    private List<SimpleOwnerDTO> owners;

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public HouseholdDTO() {
        super();
    }

    public List<SimpleOwnerDTO> getOwners() {
        return owners;
    }

    public void setOwners(List<SimpleOwnerDTO> owners) {
        this.owners = owners;
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
