package vn.apartment.payment.service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import vn.apartment.master.client.MasterClient;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients(basePackageClasses = {MasterClient.class})
public class PaymentApplication {

	public static void main(String[] args) {
		SpringApplication.run(PaymentApplication.class, args);
	}
}
