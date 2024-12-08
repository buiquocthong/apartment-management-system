package vn.apartment.master.entity.record;

import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.master.dto.invoice.InvoiceStatus;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.setting.InvoiceSetting;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "INVOICE")
public class Invoice extends BaseEntity {

	@Column(name = "INVOICE_ID", nullable = false, unique = true)
	private String invoiceId;

	@Column(name = "PAYMENT_DEADLINE")
	private Date paymentDeadline;

	@Column(name = "STATUS")
	@Enumerated(EnumType.STRING)
	private InvoiceStatus status;

	@Column(name = "TOTAL")
	private BigDecimal total;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "APARTMENT_FK")
	private Apartment apartment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "INVOICE_SETTING_FK")
	private InvoiceSetting invoiceSetting;

	@Column(name = "EXTRA_PAYMENT_DEADLINE")
	private Date extraPaymentDeadline;

	@Column(name = "PENALTY_FEE")
	private BigDecimal penaltyFee;

	@Column(name = "IS_DELETED")
	private boolean isDeleted = Boolean.FALSE;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CREATED_DATE")
	@CreationTimestamp
	private Date createDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UPDATED_DATE")
	@UpdateTimestamp
	private Date updateDate;

	public Invoice(){
		super();
	}

	public Apartment getApartment() {
		return apartment;
	}

	public void setApartment(Apartment apartment) {
		this.apartment = apartment;
	}

	public InvoiceSetting getInvoiceSetting() {
		return invoiceSetting;
	}

	public void setInvoiceSetting(InvoiceSetting invoiceSetting) {
		this.invoiceSetting = invoiceSetting;
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

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}
}