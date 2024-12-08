package vn.apartment.notification.document;

import java.util.Date;
import java.util.Map;
import java.util.Set;

import com.google.common.collect.Maps;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.notification.dto.enums.MailStatus;
import vn.apartment.notification.dto.mail.Priority;


@Document(collection = "mail")
public class Mail {

    @Id
    private String id;
    private String from;
    private Set<String> to;
    private Set<String> cc;
    private Set<String> bcc;
    private Priority priority = Priority.NORMAL;
    private Map<String, Object> parameters = Maps.newHashMap();
    private String subject;
    private MailStatus status;
    private boolean isRetry = true;
    private int retryTimes = 0;
    @DBRef
    private Template template;
    private String content;
    private String error;
    private Date sentDate;
    private Date createdOn;
    private Date updatedOn;
    public Mail() {
        super();
    }
    public void nextRetryTime() {
        retryTimes++;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public Set<String> getTo() {
        return to;
    }

    public Set<String> getCc() {
        return cc;
    }

    public void setCc(Set<String> cc) {
        this.cc = cc;
    }

    public void setTo(Set<String> to) {
        this.to = to;
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

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
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

    public Template getTemplate() {
        return template;
    }

    public void setTemplate(Template template) {
        this.template = template;
    }

    public String getContent() {
        return content;
    }

    public boolean isRetry() {
        return isRetry;
    }

    public void setRetry(boolean retry) {
        isRetry = retry;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public Date getCreatedOn() {
        return Dates.clone(createdOn);
    }

    public Date getSentDate() {
        return sentDate;
    }

    public void setSentDate(Date sentDate) {
        this.sentDate = sentDate;
    }

    public void setCreatedOn(Date createdOn) {
        this.createdOn = Dates.clone(createdOn);
    }

    public Date getUpdatedOn() {
        return Dates.clone(updatedOn);
    }

    public void setUpdatedOn(Date updatedOn) {
        this.updatedOn = Dates.clone(updatedOn);
    }
}
