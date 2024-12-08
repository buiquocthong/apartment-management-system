package vn.apartment.notification.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import vn.apartment.notification.dto.constant.NotificationAPIs;
import vn.apartment.notification.dto.mail.MailDTO;
import vn.apartment.notification.dto.mail.MailResult;


@FeignClient(name = "mailClient", url = "${apartment.notification.url}")
public interface MailClient {

    @PostMapping(value = NotificationAPIs.MAIL_API)
    MailResult send(MailDTO mail);
}

