package vn.apartment.master.entity.resident;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import vn.apartment.core.mvc.entity.BaseEntity;
import vn.apartment.master.dto.owner.Gender;
import vn.apartment.master.entity.record.Record;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "RENTER")
public class Renter extends BaseEntity {

    @Column(name = "RENTER_ID", updatable = false, unique = true)
    private String renterId;

    @Column(name = "BIRTH_DATE")
    private Date birthday;

    @Column(name = "CAREER")
    private String career;

    @Column(name = "CITY")
    private String city;

    @Column(name = "DISTRICT")
    private String district;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "FIRST_NAME")
    private String firstName;

    @Column(name = "GENDER")
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "ID_CARD_NUMBER")
    private String idCardNumber;

    @Column(name = "IS_HOUSEHOLD_HEAD")
    private Boolean isHouseholdHead;

    @Column(name = "LAST_NAME")
    private String lastName;

    @Column(name = "MIDDLE_NAME")
    private String middleName;

    @Column(name = "PHONE_NUMBER")
    private String phoneNumber;

    @Column(name = "STREET")
    private String street;

    @Column(name = "WARD")
    private String ward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "RECORD_FK", referencedColumnName = "ID")
    private Record record;

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

    public Renter(){
        super();
    }

    public String getRenterId() {
        return renterId;
    }

    public void setRenterId(String renterId) {
        this.renterId = renterId;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getCareer() {
        return career;
    }

    public void setCareer(String career) {
        this.career = career;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getIdCardNumber() {
        return idCardNumber;
    }

    public void setIdCardNumber(String idCardNumber) {
        this.idCardNumber = idCardNumber;
    }

    public Boolean getHouseholdHead() {
        return isHouseholdHead;
    }

    public void setHouseholdHead(Boolean householdHead) {
        isHouseholdHead = householdHead;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getMiddleName() {
        return middleName;
    }

    public void setMiddleName(String middleName) {
        this.middleName = middleName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getWard() {
        return ward;
    }

    public void setWard(String ward) {
        this.ward = ward;
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

    public Record getRecord() {
        return record;
    }

    public void setRecord(Record record) {
        this.record = record;
    }
}
