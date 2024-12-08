package vn.apartment.master.conf;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import vn.apartment.core.model.event.Event;
import vn.apartment.core.redis.RedisService;
import vn.apartment.core.redis.publisher.RedisEventPublisher;

@Configuration
public class MasterPublisherRedisConfig {

    private static final String MAIL_CHANNEL = "mail-channel";

    @Bean
    RedisEventPublisher mailPublisherChannel(ChannelTopic channelTopic, RedisService redisService) {
        return new RedisEventPublisher(channelTopic, redisService);
    }

    @Bean
    ChannelTopic topic() {
        return new ChannelTopic(MAIL_CHANNEL);
    }

    @Bean
    RedisTemplate redisTemplate(RedisConnectionFactory connectionFactory) {
        final StringRedisTemplate template = new StringRedisTemplate(connectionFactory);

        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer
            = new Jackson2JsonRedisSerializer(Event.class);

        jackson2JsonRedisSerializer.setObjectMapper(new ObjectMapper());
        template.setValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }

    @Bean
    public RedisService redisService(RedisTemplate redisTemplate) {
        return new RedisService(redisTemplate);
    }

}
