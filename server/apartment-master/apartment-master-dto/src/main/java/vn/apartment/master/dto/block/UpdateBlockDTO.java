package vn.apartment.master.dto.block;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Update Block")
public class UpdateBlockDTO {

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

    public UpdateBlockDTO() {
        super();
    }

    public String getDescription() {
        return description;
    }

    public String getBlockId() {
        return blockId;
    }

    public void setBlockId(String blockId) {
        this.blockId = blockId;
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
}
