package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.resident.Household;

import java.util.Optional;

@Repository
public interface HouseHoldRepo extends JpaRepository<Household, Long>, JpaSpecificationExecutor<Household> {
    @Query(value = "select h from Household h where h.householdId = :householdId and h.isDeleted = false ")
    Optional<Household> findByHouseholdId(@Param("householdId") String householdId);
    @Query(value = "select h from Household h join h.owners o where o.ownerId = :ownerId and h.isDeleted = false")
    Optional<Household> findByOwnerId(@Param("ownerId") String ownerId);
}
