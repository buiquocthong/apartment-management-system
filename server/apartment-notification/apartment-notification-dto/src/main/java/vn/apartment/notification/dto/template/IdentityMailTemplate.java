package vn.apartment.notification.dto.template;

public enum IdentityMailTemplate {

    ADD_USER_TEMPLATE("IDENTITY_CREATE_USER_EN");

    private final String id;

    IdentityMailTemplate(String templateId) {
        this.id = templateId;
    }

    public String id() {
        return id;
    }
}
