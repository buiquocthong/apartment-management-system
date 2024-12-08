package vn.apartment.master.dto.invoice;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

@Schema(name = "Update Invoice")
public class UpdateInvoiceDTO {

    @JsonProperty(value = "invoice_id", required = true)
    private String invoiceId;

    @JsonProperty(value = "payment_deadline", required = true)
    private Date paymentDeadline;

    @JsonProperty(value = "status", required = true)
    private InvoiceStatus status;

    public UpdateInvoiceDTO() {
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

    public InvoiceStatus getStatus() {
        return status;
    }

    public void setStatus(InvoiceStatus status) {
        this.status = status;
    }
}
