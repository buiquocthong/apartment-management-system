package vn.apartment.identity;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;
import vn.apartment.core.mvc.anotation.WebMvc;
import vn.apartment.notification.client.MailClient;


@SpringBootApplication
@WebMvc
@EnableTransactionManagement
@EntityScan(basePackages = {"vn.apartment.core.mvc.entity", "vn.apartment.identity.entity"})
@EnableJpaRepositories(basePackages = {"vn.apartment.identity.dao"})
@EnableEurekaClient
@EnableFeignClients(basePackageClasses = {MailClient.class})
public class IdentityApplication {

    public static void main(String[] args) {
        SpringApplication.run(IdentityApplication.class, args);
    }

}
