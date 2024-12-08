package vn.apartment.core.redis.publisher;

import org.springframework.data.redis.listener.ChannelTopic;
import vn.apartment.core.model.event.Event;
import vn.apartment.core.model.publisher.EventPublisher;
import vn.apartment.core.redis.RedisService;

public class RedisEventPublisher implements EventPublisher<Event> {

    private final ChannelTopic channelTopic;
    private final RedisService redisService;

    public RedisEventPublisher(ChannelTopic channelTopic, RedisService redisService) {
        this.channelTopic = channelTopic;
        this.redisService = redisService;
    }

    @Override
    public void publish(Event event) {
        redisService.publish(channelTopic.getTopic(), event);
    }
}
