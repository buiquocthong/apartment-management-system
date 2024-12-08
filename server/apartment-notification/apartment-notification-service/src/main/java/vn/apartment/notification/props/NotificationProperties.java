package vn.apartment.notification.props;

import java.util.HashSet;
import java.util.Set;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "apartment.notification")
public class NotificationProperties {

    private Email email;

    public NotificationProperties() {
        super();
    }

    public Email getEmail() {
        return email;
    }

    public void setEmail(Email email) {
        this.email = email;
    }

    public static class Email {

        private String from;

        private Set<String> bcc = new HashSet<>();

        private int maxRetryTimes = 2;

        public Email() {
            super();
        }

        public String getFrom() {
            return from;
        }

        public void setFrom(String from) {
            this.from = from;
        }

        public Set<String> getBcc() {
            return bcc;
        }

        public void setBcc(Set<String> bcc) {
            this.bcc = bcc;
        }

        public int getMaxRetryTimes() {
            return maxRetryTimes;
        }

        public void setMaxRetryTimes(int maxRetryTimes) {
            this.maxRetryTimes = maxRetryTimes;
        }
    }
}
