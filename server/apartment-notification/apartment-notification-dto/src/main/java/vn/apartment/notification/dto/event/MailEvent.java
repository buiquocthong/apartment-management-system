package vn.apartment.notification.dto.event;

import vn.apartment.core.model.event.Event;
import vn.apartment.notification.dto.mail.MailDTO;

public class MailEvent extends Event<MailDTO> {

    public static MailEvent standard() {
        return new MailEvent();
    }

}
