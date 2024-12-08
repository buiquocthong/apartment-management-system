package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.master.dto.invoice.InvoiceStatus;
import vn.apartment.master.entity.record.Invoice;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface InvoiceRepo extends JpaRepository<Invoice, Long>, JpaSpecificationExecutor<Invoice> {
    @Query(value = "select i from Invoice i where i.invoiceId = :invoiceId and i.isDeleted = false ")
    Optional<Invoice> findByInvoiceId(@Param("invoiceId") final String invoiceId);
    @Query(value = "select i from Invoice i join i.apartment a where a.apartmentId = :apartmentId and i.isDeleted = true ")
    List<Invoice> findOldInvoicesByApartmentId(@Param("apartmentId") final String apartmentId);
    @Query(value = "select i from Invoice i join i.apartment a where a.apartmentId = :apartmentId and i.isDeleted = false ")
    Optional<Invoice> findByApartmentId(@Param("apartmentId") final String apartmentId);
    @Query("select i from Invoice i where i.paymentDeadline >= :startOfDay and i.paymentDeadline < :endOfDay and i.isDeleted = false and i.status = :status")
    List<Invoice> findByPaymentDeadline(@Param("startOfDay") Date startOfDay, @Param("endOfDay") Date endOfDay, InvoiceStatus status);
}
