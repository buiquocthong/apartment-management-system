package vn.apartment.notification.listener;

import org.springframework.stereotype.Component;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import vn.apartment.notification.dto.event.MailEvent;
import vn.apartment.notification.dto.mail.MailDTO;
import vn.apartment.notification.dto.mail.MailResult;
import vn.apartment.notification.interactor.mail.ScheduleMail;
import org.springframework.data.redis.connection.Message;
import org.springframework.data.redis.connection.MessageListener;

@Component
public class MailEventSubscriber implements MessageListener {

    private static final Logger LOG = LoggerFactory.getLogger(MailEventSubscriber.class);

    @Autowired
    private ScheduleMail scheduleMail;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void onMessage(Message message, byte[] pattern) {
        try {

            if (LOG.isDebugEnabled()) {
                LOG.debug("On message {}", message);
            }

            MailEvent event = objectMapper.readValue(message.getBody(), MailEvent.class);

            MailDTO mail = event.getPayload();

            if (mail == null) {
                LOG.warn("Skip due to fired the empty mail event payload.");
                return;
            }

            LOG.info("Received the mail message {} on the channel {} .",
                event.getId(), new String(message.getChannel()));

            MailResult mailResult = scheduleMail.execute(mail);

            LOG.info("Scheduled the mail {} on success.", mailResult.getMailId());

        } catch (Exception ex) {
            LOG.error("Couldn't handle the subscriber message {}.", message, ex);
        }
    }
}
