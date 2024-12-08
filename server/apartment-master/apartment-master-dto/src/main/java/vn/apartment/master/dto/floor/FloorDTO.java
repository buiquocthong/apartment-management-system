package vn.apartment.master.dto.floor;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;

import java.util.Date;
import java.util.List;

@Schema(name = "Floor")
public class FloorDTO {

    @JsonProperty(value = "floor_id")
    private String floorId;

    @JsonProperty(value = "floor_number")
    private int floorNumber;

    @JsonProperty(value = "floor_type")
    private FloorType floorType;

    @JsonProperty(value = "apartments")
    private List<SimpleApartmentDTO> apartments;

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public FloorDTO() {
        super();
    }

    public String getFloorId() {
        return floorId;
    }

    public void setFloorId(String floorId) {
        this.floorId = floorId;
    }

    public int getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(int floorNumber) {
        this.floorNumber = floorNumber;
    }

    public FloorType getFloorType() {
        return floorType;
    }

    public void setFloorType(FloorType floorType) {
        this.floorType = floorType;
    }

    public List<SimpleApartmentDTO> getApartments() {
        return apartments;
    }

    public void setApartments(List<SimpleApartmentDTO> apartments) {
        this.apartments = apartments;
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
