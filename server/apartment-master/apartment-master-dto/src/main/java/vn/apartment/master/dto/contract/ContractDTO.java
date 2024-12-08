package vn.apartment.master.dto.contract;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.apartment.SimpleApartmentDTO;
import vn.apartment.master.dto.owner.AddOwnerDTO;

import java.util.Date;

@Schema(name = "Contract")
public class ContractDTO {

    @JsonProperty(value = "contract_id")
    private String contractId;

    @JsonProperty(value = "start_date", required = true)
    private Date startDate;

    @JsonProperty(value = "end_date", required = true)
    private Date endDate;

    @JsonProperty(value = "status", required = true)
    private ContractStatus status;

    @JsonProperty(value = "apartment", required = true)
    private SimpleApartmentDTO apartment;

    @JsonProperty(value = "owner", required = true)
    private AddOwnerDTO owner;

    @JsonProperty(value = "create_date", required = true)
    private Date createDate;

    @JsonProperty(value = "update_date", required = true)
    private Date updateDate;

    public ContractDTO() {
        super();
    }

    public String getContractId() {
        return contractId;
    }

    public void setContractId(String contractId) {
        this.contractId = contractId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public ContractStatus getStatus() {
        return status;
    }

    public void setStatus(ContractStatus status) {
        this.status = status;
    }

    public SimpleApartmentDTO getApartment() {
        return apartment;
    }

    public void setApartment(SimpleApartmentDTO apartment) {
        this.apartment = apartment;
    }

    public AddOwnerDTO getOwner() {
        return owner;
    }

    public void setOwner(AddOwnerDTO owner) {
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
