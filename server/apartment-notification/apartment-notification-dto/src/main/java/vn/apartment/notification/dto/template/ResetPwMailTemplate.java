package vn.apartment.notification.dto.template;

public enum ResetPwMailTemplate {

    RESET_PASSWORD_TEMPLATE("IDENTITY_RESET_PASSWORD_EN");

    private final String id;

    ResetPwMailTemplate(String templateId) {
        this.id = templateId;
    }

    public String id() {
        return id;
    }
}
