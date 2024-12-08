package vn.apartment.master.dto.apartment;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.owner.SimpleOwnerDTO;
import vn.apartment.master.dto.resident.ResidentDTO;
import vn.apartment.master.dto.servicedetail.ServiceDetailDTO;

import java.util.Date;
import java.util.List;

@Schema(name = "Apartment")
public class ApartmentDTO extends SimpleApartmentDTO{

    @JsonProperty(value = "service_details")
    private List<ServiceDetailDTO> serviceDetail;

    @JsonProperty(value = "owner")
    private SimpleOwnerDTO owner;

    @JsonProperty(value = "residents")
    private List<ResidentDTO> resident;

    @JsonProperty(value = "create_date")
    private Date createDate;

    @JsonProperty(value = "update_date")
    private Date updateDate;

    public ApartmentDTO() {
        super();
    }

    public List<ServiceDetailDTO> getServiceDetail() {
        return serviceDetail;
    }

    public void setServiceDetail(List<ServiceDetailDTO> serviceDetail) {
        this.serviceDetail = serviceDetail;
    }

    public List<ResidentDTO> getResident() {
        return resident;
    }

    public void setResident(List<ResidentDTO> resident) {
        this.resident = resident;
    }

    public SimpleOwnerDTO getOwner() {
        return owner;
    }

    public void setOwner(SimpleOwnerDTO owner) {
        this.owner = owner;
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
