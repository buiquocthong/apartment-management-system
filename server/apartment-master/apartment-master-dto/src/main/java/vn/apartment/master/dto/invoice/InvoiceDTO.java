package vn.apartment.master.dto.invoice;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.master.dto.apartment.ApartmentDTO;

import java.math.BigDecimal;
import java.util.Date;

@Schema(name = "Invoice")
public class InvoiceDTO {

    @JsonProperty(value = "invoice_id")
    private String invoiceId;

    @JsonProperty(value = "payment_deadline", required = true)
    private Date paymentDeadline;

    @JsonProperty(value = "extra_payment_deadline", required = true)
    private Date extraPaymentDeadline;

    @JsonProperty(value = "penalty_fee", required = true)
    private BigDecimal penaltyFee;

    @JsonProperty(value = "status", required = true)
    private InvoiceStatus status;

    @JsonProperty(value = "total", required = true)
    private BigDecimal total;

    @JsonProperty(value = "apartment", required = true)
    private ApartmentDTO apartment;

    @JsonProperty(value = "create_date", required = true)
    private Date createDate;

    @JsonProperty(value = "update_date", required = true)
    private Date updateDate;

    public InvoiceDTO() {
        super();
    }

    public String getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(String invoiceId) {
        this.invoiceId = invoiceId;
    }

    public Date getPaymentDeadline() {
        return paymentDeadline;
    }

    public void setPaymentDeadline(Date paymentDeadline) {
        this.paymentDeadline = paymentDeadline;
    }

    public Date getExtraPaymentDeadline() {
        return extraPaymentDeadline;
    }

    public void setExtraPaymentDeadline(Date extraPaymentDeadline) {
        this.extraPaymentDeadline = extraPaymentDeadline;
    }

    public BigDecimal getPenaltyFee() {
        return penaltyFee;
    }

    public void setPenaltyFee(BigDecimal penaltyFee) {
        this.penaltyFee = penaltyFee;
    }

    public InvoiceStatus getStatus() {
        return status;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public void setTotal(BigDecimal total) {
        this.total = total;
    }

    public ApartmentDTO getApartment() {
        return apartment;
    }

    public void setApartment(ApartmentDTO apartment) {
        this.apartment = apartment;
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
