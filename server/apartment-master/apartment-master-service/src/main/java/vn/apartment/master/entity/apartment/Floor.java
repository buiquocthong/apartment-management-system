package vn.apartment.master.entity.apartment;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.master.dto.floor.FloorType;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "FLOOR")
public class Floor extends BaseEntity {

    @Column(name = "FLOOR_ID", nullable = false, unique = true)
    private String floorId;

    @Column(name = "FLOOR_NUMBER", nullable = false)
    private int floorNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "FLOOR_TYPE")
    private FloorType floorType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BLOCK_FK", referencedColumnName = "ID")
    private Block block;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "CREATED_DATE")
    @CreationTimestamp
    private Date createDate;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "UPDATED_DATE")
    @UpdateTimestamp
    private Date updateDate;

    public Floor() {
        super();
    }

    public String getFloorId() {
        return floorId;
    }

    public void setFloorId(String floorId) {
        this.floorId = floorId;
    }

    public int getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(int floorNumber) {
        this.floorNumber = floorNumber;
    }

    public FloorType getFloorType() {
        return floorType;
    }

    public void setFloorType(FloorType floorType) {
        this.floorType = floorType;
    }

    public Block getBlock() {
        return block;
    }

    public void setBlock(Block block) {
        this.block = block;
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
