package vn.apartment.payment.client;

import vn.apartment.payment.client.constant.PaypalAPIs;
import vn.apartment.payment.client.dto.PaypalRequest;
import vn.apartment.payment.client.dto.PaypalResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;


@FeignClient(name = "paymentClient", url = "${apartment.payment.url}")
public interface PaymentClient {

    @PostMapping(value = PaypalAPIs.CREATE_PAYMENT_API)
    PaypalResponse createPayment(@RequestBody PaypalRequest paymentRequest);

    @GetMapping(value = PaypalAPIs.SUCCESS_PAYMENT_API)
    PaypalResponse paymentSuccess(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId);
}
