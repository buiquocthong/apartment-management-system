package vn.apartment.master.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.apartment.master.entity.setting.InvoiceSetting;

import java.util.Optional;

@Repository
public interface InvoiceSettingRepo extends JpaRepository<InvoiceSetting, Long> {
    Optional<InvoiceSetting> findByInvoiceSettingId(final String invoiceSettingId);
}
