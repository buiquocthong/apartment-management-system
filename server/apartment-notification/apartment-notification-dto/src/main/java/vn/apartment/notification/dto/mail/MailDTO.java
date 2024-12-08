package vn.apartment.notification.dto.mail;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.google.common.collect.Maps;
import com.google.common.collect.Sets;
import io.swagger.v3.oas.annotations.media.Schema;
import org.apache.commons.lang3.ObjectUtils;

import java.util.Map;


@Schema(name = "Mail")
public class MailDTO extends SimpleMailDTO {

    @JsonProperty(value = "templateId", required = true)
    private String templateId;

    @JsonProperty(value = "parameters")
    private Map<String, Object> parameters = Maps.newHashMap();

    public MailDTO() {
        super();
    }

    public static MailDTO mail() {
        return new MailDTO();
    }
    @JsonIgnore
    public boolean isValid() {
        return ObjectUtils.isNotEmpty(getTo())
            && ObjectUtils.isNotEmpty(getSubject())
            && ObjectUtils.isNotEmpty(templateId);
    }
    public MailDTO tos(String... to) {
        setTo(Sets.newHashSet(to));
        return this;
    }
    public MailDTO cc(String... cc) {
        setCc(Sets.newHashSet(cc));
        return this;
    }
    public MailDTO bcc(String... bcc) {
        setBcc(Sets.newHashSet(bcc));
        return this;
    }
    public MailDTO priority(Priority priority) {
        setPriority(priority);
        return this;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public MailDTO templateId(String id) {
        setTemplateId(id);
        return this;
    }
    public MailDTO subject(String emailSubject) {
        setSubject(emailSubject);
        return this;
    }

    public Map<String, Object> getParameters() {
        return parameters;
    }

    public void setParameters(Map<String, Object> parameters) {
        this.parameters = parameters;
    }
    public MailDTO parameter(String key, Object value) {
        parameters.putIfAbsent(key, value);
        return this;
    }
}
