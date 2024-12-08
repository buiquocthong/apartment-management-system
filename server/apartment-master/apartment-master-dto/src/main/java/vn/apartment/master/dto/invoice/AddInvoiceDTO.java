package vn.apartment.master.dto.invoice;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.util.Date;

@Schema(name = "Add Invoice")
public class AddInvoiceDTO {

    @JsonProperty(value = "payment_deadline", required = true)
    private Date paymentDeadline;

    @JsonProperty(value = "status", required = true)
    private InvoiceStatus status = InvoiceStatus.UNPAID;

    @JsonProperty(value = "apartment_id", required = true)
    private String apartmentId;

    public AddInvoiceDTO() {
        super();
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

    public String getApartmentId() {
        return apartmentId;
    }

    public void setApartmentId(String apartmentId) {
        this.apartmentId = apartmentId;
    }
}
