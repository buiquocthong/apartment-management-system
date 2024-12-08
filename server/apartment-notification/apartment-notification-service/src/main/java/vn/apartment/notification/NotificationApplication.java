package vn.apartment.notification;

import com.github.cloudyrock.spring.v5.EnableMongock;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.freemarker.FreeMarkerAutoConfiguration;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

import vn.apartment.core.mvc.anotation.WebMvc;

@SpringBootApplication(exclude = {FreeMarkerAutoConfiguration.class})
@WebMvc
@EnableMongoRepositories(basePackages = {"vn.apartment.notification.dao"})
@EnableEurekaClient
@EnableMongock
public class NotificationApplication {

    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(NotificationApplication.class);
        application.run(args);
    }
}
