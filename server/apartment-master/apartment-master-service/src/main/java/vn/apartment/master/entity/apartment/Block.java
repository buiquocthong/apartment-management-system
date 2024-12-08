package vn.apartment.master.entity.apartment;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "BLOCK")
public class Block extends BaseEntity {

	@Column(name = "BLOCK_ID", nullable = false, unique = true)
	private String blockId;

	@Column(name = "DESCRIPTION")
	private String description;

	@Column(name = "NAME", nullable = false)
	private String name;

	@Column(name = "TOTAL_APARTMENT")
	private int totalApartment;

	@Column(name = "TOTAL_FLOOR")
	private int totalFloor;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "CREATED_DATE")
	@CreationTimestamp
	private Date createDate;

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "UPDATED_DATE")
	@UpdateTimestamp
	private Date updateDate;

	public Block(){
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

	public String getBlockId() {
		return blockId;
	}

	public void setBlockId(String blockId) {
		this.blockId = blockId;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getTotalApartment() {
		return totalApartment;
	}

	public void setTotalApartment(int totalApartment) {
		this.totalApartment = totalApartment;
	}

	public int getTotalFloor() {
		return totalFloor;
	}

	public void setTotalFloor(int totalFloor) {
		this.totalFloor = totalFloor;
	}
}