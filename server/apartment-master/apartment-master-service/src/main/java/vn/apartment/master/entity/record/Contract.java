package vn.apartment.master.entity.record;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.master.dto.contract.ContractStatus;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.resident.Owner;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "CONTRACT")
public class Contract extends BaseEntity {

	@Column(name = "CONTRACT_ID", nullable = false, unique = true)
	private String contractId;

	@Column(name = "START_DATE")
	@Temporal(TemporalType.TIMESTAMP)
	private Date startDate;

	@Column(name = "END_DATE")
	@Temporal(TemporalType.TIMESTAMP)
	private Date endDate;

	@Enumerated(EnumType.STRING)
	@Column(name = "STATUS", nullable = false)
	private ContractStatus status;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "APARTMENT_FK", referencedColumnName = "ID")
	private Apartment apartment;

	@OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
	@JoinColumn(name = "OWNER_FK", referencedColumnName = "ID")
	private Owner owner;

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

	public Contract(){
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

	public ContractStatus getStatus() {
		return status;
	}

	public void setStatus(ContractStatus status) {
		this.status = status;
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

	public Owner getResident() {
		return owner;
	}

	public void setResident(Owner owner) {
		this.owner = owner;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public boolean isDeleted() {
		return isDeleted;
	}

	public void setDeleted(boolean deleted) {
		isDeleted = deleted;
	}

	public Owner getOwner() {
		return owner;
	}

	public void setOwner(Owner owner) {
		this.owner = owner;
	}
}