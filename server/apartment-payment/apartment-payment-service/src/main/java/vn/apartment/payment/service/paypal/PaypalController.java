package vn.apartment.payment.service.paypal;

import com.paypal.api.payments.Links;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.PayPalRESTException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.apartment.master.client.MasterClient;
import vn.apartment.payment.service.constant.PaypalAPIs;
import vn.apartment.payment.service.constant.PaypalConstant;
import vn.apartment.payment.service.dto.PaypalRequest;
import vn.apartment.payment.service.dto.PaypalResponse;
import vn.apartment.payment.service.service.PaypalService;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;

@RestController
@Slf4j
public class PaypalController {

    @Autowired
    private PaypalService paypalService;
    @Autowired
    private MasterClient masterClient;

    @Value("${paypal.success.url}")
    private String baseUrl;

    @PostMapping(PaypalAPIs.CREATE_PAYMENT_API)
    public PaypalResponse createPayment(@RequestBody PaypalRequest paymentRequest) {
        try {
            String cancelUrl = "/";
            String successUrl =  baseUrl + PaypalAPIs.SUCCESS_PAYMENT_API;
            Payment payment = paypalService.createPayment(Double.valueOf(paymentRequest.getAmount()), PaypalConstant.CURRENCY,
                    PaypalConstant.PAYMENT_METHOD, PaypalConstant.PAYMENT_INTENT, paymentRequest.getInvoiceId(), cancelUrl, successUrl);

            for (Links links: payment.getLinks()) {
                if (links.getRel().equals(PaypalConstant.APPROVAL_URL)) {
                    return new PaypalResponse("pending", links.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Error occurred while creating payment: ", e);
            return new PaypalResponse("error", "Failed to create payment");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return new PaypalResponse("error", "Failed to create payment");
    }

    @GetMapping(PaypalAPIs.SUCCESS_PAYMENT_API)
    public ResponseEntity<Void> paymentSuccess(@RequestParam("paymentId") String paymentId, @RequestParam("PayerID") String payerId, HttpServletResponse httpResponse) {
        try {
            Payment payment = paypalService.executePayment(paymentId, payerId);

            if (payment.getState().equals("approved")) {
                if (payment.getTransactions() != null && !payment.getTransactions().isEmpty()) {
                    Transaction transaction = payment.getTransactions().get(0);

                    String invoiceId = transaction.getInvoiceNumber();

                    ResponseEntity<String> response = masterClient.completeInvoice(invoiceId);
                    if (response.getStatusCode().is2xxSuccessful()) {
                        return ResponseEntity
                                .status(HttpStatus.FOUND)
                                .location(URI.create("https://payment-ams.vercel.app/payments/success"))
                                .build();
                    } else {
                        return ResponseEntity
                                .status(HttpStatus.FOUND)
                                .location(URI.create("https://payment-ams.vercel.app/payments/failure"))
                                .build();
                    }
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Detailed PayPal Error: {}", e.getMessage(), e);
        } catch (Exception ex) {
            log.error("Error occurred while completing invoice: {}", ex.getMessage(), ex);
        }
        return ResponseEntity
                .status(HttpStatus.FOUND)
                .location(URI.create("https://payment-ams.vercel.app/payments/failure"))
                .build();
    }
}
