package vn.apartment.master;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import vn.apartment.core.mvc.anotation.WebMvc;
import vn.apartment.notification.client.MailClient;
import vn.apartment.payment.client.PaymentClient;


@WebMvc
@EnableTransactionManagement
@EntityScan(basePackages = {"vn.apartment.master.entity"})
@EnableJpaRepositories(basePackages = {"vn.apartment.master.dao"})
@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients(basePackageClasses = {MailClient.class, PaymentClient.class})
public class MasterApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(MasterApplication.class);
        application.run(args);
    }
}
