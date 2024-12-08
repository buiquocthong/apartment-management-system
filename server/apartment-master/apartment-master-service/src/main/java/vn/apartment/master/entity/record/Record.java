package vn.apartment.master.entity.record;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.master.entity.resident.Owner;
import vn.apartment.master.entity.resident.Renter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "RECORD")
public class Record extends BaseEntity {

    @Column(name = "RECORD_ID", nullable = false, unique = true)
    private String recordId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "OWNER_FK", referencedColumnName = "ID")
    private Owner owner;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL, mappedBy = "record")
    private List<Renter> renters;

    @Column(name = "START_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date startDate;

    @Column(name = "END_DATE")
    @Temporal(TemporalType.TIMESTAMP)
    private Date endDate;

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

    public Record() {
        super();
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    public List<Renter> getRenters() {
        return renters;
    }

    public void setRenters(List<Renter> renters) {
        this.renters = renters;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public boolean isDeleted() {
        return isDeleted;
    }

    public void setDeleted(boolean deleted) {
        isDeleted = deleted;
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
