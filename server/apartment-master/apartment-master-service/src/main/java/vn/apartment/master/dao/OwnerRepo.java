package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.resident.Owner;

import java.util.List;
import java.util.Optional;

@Repository
public interface OwnerRepo extends JpaRepository<Owner, Long>, JpaSpecificationExecutor<Owner> {
    @Query(value = "select o from Owner o where o.ownerId = :ownerId and o.isDeleted = false and o.isHouseholdHead = true")
    Optional<Owner> findHeadByOwnerId(@Param("ownerId") final String ownerId);
    @Query(value = "select o from Owner o where o.ownerId = :ownerId and o.isDeleted = false")
    Optional<Owner> findByOwnerId(@Param("ownerId") final String ownerId);
    @Query(value = "select c.owner from Contract c join c.owner o where c.apartment.apartmentId = :apartmentId and o.isDeleted = false")
    Optional<Owner> findByApartmentId(@Param("apartmentId") final String apartmentId);
    @Query(value = "select o from Owner o join o.household  h where h.householdId = :householdId and o.isDeleted = false ")
    List<Owner> findByHouseholdId(@Param("householdId") final String householdId);
    @Query(value = "select r.owner from Record r where r.recordId = :recordId and r.owner.isDeleted = false ")
    Optional<Owner> findByRecordId(@Param("recordId") final String recordId);
    @Query(value = "select o from Owner o where o.isDeleted = true ")
    List<Owner> findOldOwners();
}
