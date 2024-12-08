package vn.apartment.master.dto.apartment;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Update Apartment")
public class UpdateApartmentDTO {

    @JsonProperty(value = "apartment_id")
    private String apartmentId;

    @JsonProperty(value = "area", required = true)
    private double area;

    @JsonProperty(value = "name", required = true)
    private String name;

    @JsonProperty(value = "sale_info")
    private SaleInfoDTO saleInfo;

    @JsonProperty(value = "status", required = true)
    private ApartmentStatus status = ApartmentStatus.AVAILABLE;

    @JsonProperty(value = "furnished")
    private Boolean isFurnished;

    @JsonProperty(value = "number_of_bedroom")
    private int numberOfBedroom;

    @JsonProperty(value = "number_of_bathroom")
    private int numberOfBathroom;

    public UpdateApartmentDTO(){
        super();
    }

    public String getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(String apartmentId) {
        this.apartmentId = apartmentId;
    }

    public double getArea() {
        return area;
    }

    public void setArea(double area) {
        this.area = area;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public SaleInfoDTO getSaleInfo() {
        return saleInfo;
    }

    public void setSaleInfo(SaleInfoDTO saleInfo) {
        this.saleInfo = saleInfo;
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

    public ApartmentStatus getStatus() {
        return status;
    }

    public void setStatus(ApartmentStatus status) {
        this.status = status;
    }

    public Boolean getFurnished() {
        return isFurnished;
    }

    public void setFurnished(Boolean furnished) {
        isFurnished = furnished;
    }
}