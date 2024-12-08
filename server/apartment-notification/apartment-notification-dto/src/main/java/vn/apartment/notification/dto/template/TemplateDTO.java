package vn.apartment.notification.dto.template;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.apartment.core.utils.Dates;


@Schema(name = "Template")
public class TemplateDTO {

    @JsonProperty(value = "id")
    private String id;

    @JsonProperty(value = "version")
    private String version;

    @JsonProperty(value = "serviceId")
    private String serviceId;

    @JsonProperty(value = "html")
    private String html;

    @JsonProperty(value = "created_at")
    private Date createdAt;

    @JsonProperty(value = "updated_at")
    private Date updatedAt;

    public TemplateDTO() {
        super();
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public Date getCreatedAt() {
        return Dates.clone(createdAt);
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = Dates.clone(createdAt);
    }

    public Date getUpdatedAt() {
        return Dates.clone(updatedAt);
    }

    public void setUpdatedAt(Date updatedAt) {
        this.updatedAt = Dates.clone(updatedAt);
    }
}
