package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.resident.Renter;

import java.util.List;
import java.util.Optional;

@Repository
public interface RenterRepo extends JpaRepository<Renter, Long>, JpaSpecificationExecutor<Renter> {
    @Query(value = "select r from Renter r where r.renterId = :renterId and r.isDeleted = false ")
    Optional<Renter> findByRenterId(@Param("renterId") final String renterId);
    @Query(value = "select r from Renter r join r.record rd where rd.recordId = :recordId and r.isDeleted = false ")
    List<Renter> findByRecordId(@Param("recordId") final String recordId);
    @Query(value = "select r from Renter r join r.record rd where rd.recordId = :recordId ")
    List<Renter> findOldRentersByRecordId(@Param("recordId") final String recordId);
    @Query(value = "select r from Renter r join r.record rd where rd.recordId = :recordId and r.isHouseholdHead = true and r.isDeleted = false ")
    Optional<Renter> findHeadByRecordId(@Param("recordId") final String recordId);
    @Query(value = "select r from Renter r where r.isDeleted = true ")
    List<Renter> findOldRenters();
}
