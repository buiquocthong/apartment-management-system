package vn.apartment.master.dto.block;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.floor.FloorDTO;

import java.util.Date;
import java.util.List;

@Schema(name = "Block")
public class BlockDTO {

    @JsonProperty(value = "block_id")
    private String blockId;

    @JsonProperty(value = "description", required = true)
    private String description;

    @JsonProperty(value = "name", required = true)
    private String name;

    @JsonProperty(value = "total_apartment", required = true)
    private int totalApartment;

    @JsonProperty(value = "total_floor", required = true)
    private int totalFloor;

    @JsonProperty(value = "floor")
    private List<FloorDTO> floor;

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public BlockDTO() {
        super();
    }

    public String getBlockId() {
        return blockId;
    }

    public void setBlockId(String blockId) {
        this.blockId = blockId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getTotalApartment() {
        return totalApartment;
    }

    public void setTotalApartment(int totalApartment) {
        this.totalApartment = totalApartment;
    }

    public int getTotalFloor() {
        return totalFloor;
    }

    public void setTotalFloor(int totalFloor) {
        this.totalFloor = totalFloor;
    }

    public List<FloorDTO> getFloor() {
        return floor;
    }

    public void setFloor(List<FloorDTO> floor) {
        this.floor = floor;
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
