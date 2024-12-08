package vn.apartment.master.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import vn.apartment.master.dto.constant.MasterAPIs;

@FeignClient(name = "masterClient", url = "${apartment.master.url}")
public interface MasterClient {

    @PutMapping(MasterAPIs.PAID_INVOICE_API)
    ResponseEntity<String> completeInvoice(@PathVariable(name = "invoiceId") String invoiceId);
}
