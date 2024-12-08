package vn.apartment.api.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import vn.apartment.identity.client.auth.KeyClient;

@SpringBootApplication
@EnableEurekaClient
@EnableFeignClients(basePackageClasses = KeyClient.class)
public class ApiGatewayApplication{
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
