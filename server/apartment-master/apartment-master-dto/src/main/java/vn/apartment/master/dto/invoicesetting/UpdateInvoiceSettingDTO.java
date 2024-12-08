package vn.apartment.master.dto.invoicesetting;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;


@Schema(name = "Update Invoice Setting")
public class UpdateInvoiceSettingDTO {

    @JsonProperty(value = "max_expired_time")
    private int maxExpiredTime;

    @JsonProperty(value = "penalty_fee_percentage")
    private double penaltyFeePercentage;

    public UpdateInvoiceSettingDTO() {
        super();
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
}
