package vn.apartment.master.dto.block;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

@Schema(name = "Add Block")
public class AddBlockDTO {

    @JsonProperty(value = "description", required = true)
    private String description;

    @JsonProperty(value = "name", required = true)
    private String name;

    @JsonProperty(value = "total_floor", required = true)
    private int totalFloor;

    @JsonProperty(value = "apartment_per_floor", required = true)
    private int apartmentsPerFloor;

    @JsonProperty(value = "area", required = true)
    private double area;

    @JsonProperty(value = "furnished")
    private Boolean isFurnished;

    @JsonProperty(value = "number_of_bedroom")
    private int numberOfBedroom;

    @JsonProperty(value = "number_of_bathroom")
    private int numberOfBathroom;

    @JsonProperty(value = "purchase_price")
    private BigDecimal purchasePrice;

    public AddBlockDTO() {
        super();
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

    public int getTotalFloor() {
        return totalFloor;
    }

    public void setTotalFloor(int totalFloor) {
        this.totalFloor = totalFloor;
    }

    public int getApartmentsPerFloor() {
        return apartmentsPerFloor;
    }

    public void setApartmentsPerFloor(int apartmentsPerFloor) {
        this.apartmentsPerFloor = apartmentsPerFloor;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

    public Boolean getFurnished() {
        return isFurnished;
    }

    public void setFurnished(Boolean furnished) {
        isFurnished = furnished;
    }

    public int getNumberOfBedroom() {
        return numberOfBedroom;
    }

    public void setNumberOfBedroom(int numberOfBedroom) {
        this.numberOfBedroom = numberOfBedroom;
    }

    public int getNumberOfBathroom() {
        return numberOfBathroom;
    }

    public void setNumberOfBathroom(int numberOfBathroom) {
        this.numberOfBathroom = numberOfBathroom;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }
}
