package vn.apartment.master.entity.apartment;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.entity.service.ServiceDetail;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "APARTMENT")
public class Apartment extends BaseEntity {

	@Column(name = "APARTMENT_ID", nullable = false, unique = true)
	private String apartmentId;

	@Column(name = "NAME", nullable = false, unique = true)
	private String name;

	@Column(name = "AREA")
	private double area;

	@Column(name = "NUMBER_OF_BEDROOM")
	private int numberOfBedroom;

	@Column(name = "NUMBER_OF_BATHROOM")
	private int numberOfBathroom;

	@Embedded
	private SaleInfo saleInfo;

	@Enumerated(EnumType.STRING)
	@Column(name = "STATUS")
	private ApartmentStatus status;

	@Column(name = "IS_FURNISHED")
	private Boolean isFurnished;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "FLOOR_FK", referencedColumnName = "ID")
	private Floor floor;

	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "apartment")
	private List<ServiceDetail> serviceDetail;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CREATED_DATE")
	@CreationTimestamp
	private Date createDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UPDATED_DATE")
	@UpdateTimestamp
	private Date updateDate;

	public Apartment(){
		super();
	}

	public String getApartmentId() {
		return apartmentId;
	}

	public void setApartmentId(String apartmentId) {
		this.apartmentId = apartmentId;
	}

	public double getArea() {
		return area;
	}

	public void setArea(double area) {
		this.area = area;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public SaleInfo getSaleInfo() {
		return saleInfo;
	}

	public void setSaleInfo(SaleInfo saleInfo) {
		this.saleInfo = saleInfo;
	}

	public int getNumberOfBedroom() {
		return numberOfBedroom;
	}

	public void setNumberOfBedroom(int numberOfBedroom) {
		this.numberOfBedroom = numberOfBedroom;
	}

	public int getNumberOfBathroom() {
		return numberOfBathroom;
	}

	public void setNumberOfBathroom(int numberOfBathroom) {
		this.numberOfBathroom = numberOfBathroom;
	}

	public ApartmentStatus getStatus() {
		return status;
	}

	public Floor getFloor() {
		return floor;
	}

	public void setFloor(Floor floor) {
		this.floor = floor;
	}

	public void setStatus(ApartmentStatus status) {
		this.status = status;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public List<ServiceDetail> getServiceDetail() {
		return serviceDetail;
	}

	public void setServiceDetail(List<ServiceDetail> serviceDetail) {
		this.serviceDetail = serviceDetail;
	}

	public Boolean getFurnished() {
		return isFurnished;
	}

	public void setFurnished(Boolean furnished) {
		isFurnished = furnished;
	}

	@Embeddable
	public static class SaleInfo {
		@Column(name = "PURCHASE_PRICE")
		private BigDecimal purchasePrice;

		@Column(name = "SALE_DATE")
		@Temporal(TemporalType.TIMESTAMP)
		private Date saleDate;

		public SaleInfo() {
		}

		public SaleInfo(BigDecimal purchasePrice, Date saleDate) {
			this.purchasePrice = purchasePrice;
			this.saleDate = saleDate;
		}

		public BigDecimal getPurchasePrice() {
			return purchasePrice;
		}

		public void setPurchasePrice(BigDecimal purchasePrice) {
			this.purchasePrice = purchasePrice;
		}

		public Date getSaleDate() {
			return saleDate;
		}

		public void setSaleDate(Date saleDate) {
			this.saleDate = saleDate;
		}
	}
}