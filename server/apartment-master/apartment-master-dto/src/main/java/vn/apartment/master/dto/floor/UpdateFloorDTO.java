package vn.apartment.master.dto.floor;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Update Floor")
public class UpdateFloorDTO {

    @JsonProperty(value = "floor_id")
    private String floorId;

    @JsonProperty(value = "floor_number", required = true)
    private int floorNumber;

    @JsonProperty(value = "floor_type", required = true)
    private FloorType floorType;

    @JsonProperty(value = "block_id", required = true)
    private String blockId;

    public UpdateFloorDTO() {
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

    public String getBlockId() {
        return blockId;
    }

    public void setBlockId(String blockId) {
        this.blockId = blockId;
    }
}
