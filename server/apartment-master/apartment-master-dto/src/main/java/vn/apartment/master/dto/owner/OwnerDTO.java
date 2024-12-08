package vn.apartment.master.dto.owner;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.dto.household.SimpleHouseholdDTO;

import java.util.Date;

@Schema(name = "Owner")
public class OwnerDTO extends SimpleOwnerDTO{

    @JsonProperty(value = "apartment")
    private SimpleApartmentDTO apartment;

    @JsonProperty(value = "household")
    private SimpleHouseholdDTO household;

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public OwnerDTO() {
        super();
    }

    public SimpleApartmentDTO getApartment() {
        return apartment;
    }

    public void setApartment(SimpleApartmentDTO apartment) {
        this.apartment = apartment;
    }

    public SimpleHouseholdDTO getHousehold() {
        return household;
    }

    public void setHousehold(SimpleHouseholdDTO household) {
        this.household = household;
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
}
