package vn.apartment.master.entity.setting;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "INVOICE_SETTING")
public class InvoiceSetting extends BaseEntity {

    @Column(name = "INVOICE_SETTING_ID", updatable = false, unique = true)
    private String invoiceSettingId;

    @Column(name = "MAX_EXPIRED_TIME")
    private int maxExpiredTime;

    @Column(name = "PENALTY_FEE_PERCENTAGE")
    private double penaltyFeePercentage;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_DATE")
    @CreationTimestamp
    private Date createDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UPDATED_DATE")
    @UpdateTimestamp
    private Date updateDate;

    public InvoiceSetting() {
        super();
    }

    public int getMaxExpiredTime() {
        return maxExpiredTime;
    }

    public void setMaxExpiredTime(int maxExpiredTime) {
        this.maxExpiredTime = maxExpiredTime;
    }

    public String getInvoiceSettingId() {
        return invoiceSettingId;
    }

    public void setInvoiceSettingId(String invoiceSettingId) {
        this.invoiceSettingId = invoiceSettingId;
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
