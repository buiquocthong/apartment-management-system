package vn.apartment.master.dto.invoicesetting;


import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

@Schema(name = "Invoice Setting")
public class InvoiceSettingDTO {

    @JsonProperty(value = "invoice_setting_id")
    private String invoiceSettingId;

    @JsonProperty(value = "max_expired_time")
    private int maxExpiredTime;

    @JsonProperty(value = "penalty_fee_percentage")
    private double penaltyFeePercentage;

    @JsonProperty(value = "create_date", required = true)
    private Date createDate;

    @JsonProperty(value = "update_date", required = true)
    private Date updateDate;

    public InvoiceSettingDTO() {
        super();
    }

    public String getInvoiceSettingId() {
        return invoiceSettingId;
    }

    public void setInvoiceSettingId(String invoiceSettingId) {
        this.invoiceSettingId = invoiceSettingId;
    }

    public int getMaxExpiredTime() {
        return maxExpiredTime;
    }

    public void setMaxExpiredTime(int maxExpiredTime) {
        this.maxExpiredTime = maxExpiredTime;
    }

    public double getPenaltyFeePercentage() {
        return penaltyFeePercentage;
    }

    public void setPenaltyFeePercentage(double penaltyFeePercentage) {
        this.penaltyFeePercentage = penaltyFeePercentage;
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
