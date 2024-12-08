package vn.apartment.master.dto.floor;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Add Floor")
public class AddFloorDTO {

    @JsonProperty(value = "floor_number")
    private int floorNumber;

    @JsonProperty(value = "floor_type")
    private FloorType floorType;

    @JsonProperty(value = "block_id")
    private String blockId;

    public AddFloorDTO() {
    }

    public AddFloorDTO(int floorNumber, FloorType floorType, String blockId) {
        this.floorNumber = floorNumber;
        this.floorType = floorType;
        this.blockId = blockId;
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

    public String getBlockId() {
        return blockId;
    }

    public void setBlockId(String blockId) {
        this.blockId = blockId;
    }
}
