package vn.apartment.notification.conf;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import vn.apartment.core.mongdb.aggregate.AggregationRepository;

@Configuration
public class NotificationConfig {

    @Bean
    AggregationRepository aggregationRepository(MongoTemplate mongoTemplate) {
        return new AggregationRepository(mongoTemplate);
    }
}
