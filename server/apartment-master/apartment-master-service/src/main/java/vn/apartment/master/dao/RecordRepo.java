package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.record.Record;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecordRepo extends JpaRepository<Record, Long>, JpaSpecificationExecutor<Record> {
    @Query(value = "select r from Record r where r.recordId = :recordId ")
    Optional<Record> findByRecordId(@Param("recordId") final String recordId);
    @Query(value = "select r from Record r join r.owner o where o.ownerId = :ownerId and r.isDeleted = false ")
    Optional<Record> findByOwnerId(@Param("ownerId") final String ownerId);
    @Query(value = "select r from Record r where r.isDeleted = false ")
    List<Record> findActiveRecords();
}
