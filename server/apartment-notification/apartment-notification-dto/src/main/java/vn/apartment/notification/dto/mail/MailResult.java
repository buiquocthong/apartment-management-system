package vn.apartment.notification.dto.mail;

import vn.apartment.notification.dto.enums.MailStatus;

public class MailResult {

    private String mailId;
    private MailStatus status;

    public MailResult() {
        super();
    }

    public MailResult(String mailId, MailStatus status) {
        this.mailId = mailId;
        this.status = status;
    }

    public String getMailId() {
        return mailId;
    }

    public void setMailId(String mailId) {
        this.mailId = mailId;
    }

    public MailStatus getStatus() {
        return status;
    }

    public void setStatus(MailStatus status) {
        this.status = status;
    }
}
