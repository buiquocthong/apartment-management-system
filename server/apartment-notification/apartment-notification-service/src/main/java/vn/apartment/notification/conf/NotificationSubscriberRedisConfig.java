package vn.apartment.notification.conf;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.ChannelTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;
import vn.apartment.notification.listener.MailEventSubscriber;

@Configuration
public class NotificationSubscriberRedisConfig {

    public static final String MAIL_CHANNEL = "mail-channel";

    @Bean
    RedisMessageListenerContainer redisContainer(RedisConnectionFactory connectionFactory,
                                                 MailEventSubscriber subscriber) {

        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        container.addMessageListener(messageListener(subscriber), emailTopic());

        return container;
    }

    @Bean
    MessageListenerAdapter messageListener(MailEventSubscriber subscriber) {
        return new MessageListenerAdapter(subscriber);
    }

    @Bean
    ChannelTopic emailTopic() {
        return new ChannelTopic(MAIL_CHANNEL);
    }

}