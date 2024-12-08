package vn.apartment.notification.dto.mail;

import java.util.Date;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.notification.dto.enums.MailStatus;


@Schema(name = "Simple Mail")
public class SimpleMailDTO {

    @JsonProperty(value = "id")
    private String id;

    @JsonProperty(value = "to", required = true)
    private Set<String> to;

    @JsonProperty(value = "cc")
    private Set<String> cc;

    @JsonProperty(value = "bcc")
    private Set<String> bcc;

    @JsonProperty(value = "priority")
    private Priority priority = Priority.NORMAL;

    @JsonProperty(value = "subject", required = true)
    private String subject;

    @JsonProperty(value = "status")
    private MailStatus status = MailStatus.SCHEDULED;

    @JsonProperty(value = "retry_times")
    private int retryTimes;

    @JsonProperty(value = "error")
    private String error;

    @JsonProperty(value = "updated_on")
    private Date updatedOn;

    @JsonProperty(value = "sent_date")
    private Date sentDate;

    public SimpleMailDTO() {
        super();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<String> getTo() {
        return to;
    }

    public void setTo(Set<String> to) {
        this.to = to;
    }

    public Set<String> getCc() {
        return cc;
    }

    public void setCc(Set<String> cc) {
        this.cc = cc;
    }

    public Set<String> getBcc() {
        return bcc;
    }

    public void setBcc(Set<String> bcc) {
        this.bcc = bcc;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public MailStatus getStatus() {
        return status;
    }

    public void setStatus(MailStatus status) {
        this.status = status;
    }

    public int getRetryTimes() {
        return retryTimes;
    }

    public void setRetryTimes(int retryTimes) {
        this.retryTimes = retryTimes;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Date getUpdatedOn() {
        return Dates.clone(updatedOn);
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = Dates.clone(updatedOn);
    }

    public Date getSentDate() {
        return Dates.clone(sentDate);
    }

    public void setSentDate(Date sentDate) {
        this.sentDate = Dates.clone(sentDate);
    }
}
