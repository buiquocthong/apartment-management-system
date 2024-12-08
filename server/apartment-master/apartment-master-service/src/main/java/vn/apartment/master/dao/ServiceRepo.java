package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.service.Service;

import java.util.Optional;

@Repository
public interface ServiceRepo extends JpaRepository<Service, Long>, JpaSpecificationExecutor<Service> {
    Optional<Service> findByServiceId(String serviceId);
    Optional<Service> findByName(String name);
}
