package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.apartment.Apartment;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApartmentRepo extends JpaRepository<Apartment, Long>, JpaSpecificationExecutor<Apartment> {
    Optional<Apartment> findByName(String name);
    Optional<Apartment> findByApartmentId(String apartmentId);
    @Query(value = "select a from Apartment a join a.floor f where f.floorId = :floorId")
    List<Apartment> findByFloorId(@Param("floorId") String floorId);
    @Query(value = "select c.apartment from Contract c where c.owner.ownerId = :ownerId")
    Optional<Apartment> findByOwnerId(@Param("ownerId") String ownerId);
    @Query("select a from Contract c join c.apartment a join c.owner o join o.household h where h.householdId = :householdId and c.status = 'ACTIVE'")
    Optional<Apartment> findByHouseholdId(@Param("householdId") String householdId);
    @Query("select i.apartment from Invoice i where i.invoiceId = :invoiceId")
    Optional<Apartment> findByInvoiceId(@Param("invoiceId") String invoiceId);
}
