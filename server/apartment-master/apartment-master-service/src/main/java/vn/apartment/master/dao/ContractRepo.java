package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.record.Contract;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContractRepo extends JpaRepository<Contract, Long>, JpaSpecificationExecutor<Contract> {
    @Query(value = "select c from Contract c where c.contractId = :contractId and c.isDeleted = false ")
    Optional<Contract> findByContractId(@Param("contractId") String contractId);
    @Query(value = "select c from Contract c join c.owner o where o.ownerId = :ownerId and c.isDeleted = false ")
    Optional<Contract> findByResidentId(@Param("ownerId") String ownerId);
    @Query(value = "select c from Contract c where c.isDeleted = true ")
    List<Contract> findCanceledContracts();
}
