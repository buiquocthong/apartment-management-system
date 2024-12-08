package vn.apartment.master.entity.service;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.master.entity.apartment.Apartment;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
@Table(name = "SERVICE_DETAIL")
public class ServiceDetail extends BaseEntity {

	@Column(name = "SERVICE_DETAIL_ID", nullable = false, unique = true)
	private String serviceDetailId;

	@Column(name = "AMOUNT_OF_USING")
	private double amountOfUsing;

	@Column(name = "MONEY")
	private BigDecimal money;

	@Column(name = "NEW_VALUE")
	private double newValue;

	@Column(name = "OLD_VALUE")
	private double oldValue;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "APARTMENT_FK" , referencedColumnName = "ID")
	private Apartment apartment;

	@ManyToOne
	@JoinColumn(name = "SERVICE_FK" , referencedColumnName = "ID")
	private Service service;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CREATED_DATE")
	@CreationTimestamp
	private Date createDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UPDATED_DATE")
	@UpdateTimestamp
	private Date updateDate;

	public ServiceDetail(){
		super();
	}

	public String getServiceDetailId() {
		return serviceDetailId;
	}

	public void setServiceDetailId(String serviceDetailId) {
		this.serviceDetailId = serviceDetailId;
	}

	public double getAmountOfUsing() {
		return amountOfUsing;
	}

	public Apartment getApartment() {
		return apartment;
	}

	public void setApartment(Apartment apartment) {
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

	public void setAmountOfUsing(double amountOfUsing) {
		this.amountOfUsing = amountOfUsing;
	}

	public BigDecimal getMoney() {
		return money;
	}

	public void setMoney(BigDecimal money) {
		this.money = money;
	}

	public double getNewValue() {
		return newValue;
	}

	public void setNewValue(double newValue) {
		this.newValue = newValue;
	}

	public double getOldValue() {
		return oldValue;
	}

	public void setOldValue(double oldValue) {
		this.oldValue = oldValue;
	}

	public Service getService() {
		return service;
	}

	public void setService(Service service) {
		this.service = service;
	}
}