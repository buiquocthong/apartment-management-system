package vn.apartment.master.entity.service;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;
import java.math.BigDecimal;
import java.util.Date;
import javax.persistence.*;

@Entity
@Table(name = "SERVICE")
public class Service extends BaseEntity {

	@Column(name = "SERVICE_ID", nullable = false, unique = true)
	private String serviceId;

	@Column(name = "IS_METERED_SERVICE")
	private Boolean isMeteredService;

	@Column(name = "NAME", nullable = false)
	private String name;

	@Column(name = "PRICE", precision = 19, scale = 2)
	private BigDecimal price;

	@Column(name = "UNIT")
	private String unit;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CREATED_DATE")
	@CreationTimestamp
	private Date createDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UPDATED_DATE")
	@UpdateTimestamp
	private Date updateDate;

	public Service(){
		super();
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

	public String getServiceId() {
		return serviceId;
	}

	public void setServiceId(String serviceId) {
		this.serviceId = serviceId;
	}

	public Boolean getMeteredService() {
		return isMeteredService;
	}

	public void setMeteredService(Boolean meteredService) {
		isMeteredService = meteredService;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getPrice() {
		return price;
	}

	public void setPrice(BigDecimal price) {
		this.price = price;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}
}