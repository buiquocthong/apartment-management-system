package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.service.ServiceDetail;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceDetailRepo extends JpaRepository<ServiceDetail, Long> {
    Optional<ServiceDetail> findByServiceDetailId(String serviceDetailId);
    @Query(value = "select sd from ServiceDetail sd join sd.apartment a where a.apartmentId = :apartmentId")
    List<ServiceDetail> findByApartmentId(@Param("apartmentId") String apartmentId);
    @Query(value = "select sd from ServiceDetail sd join sd.service s where s.serviceId = :serviceId")
    List<ServiceDetail> findByServiceId(@Param("serviceId") String serviceId);
}
