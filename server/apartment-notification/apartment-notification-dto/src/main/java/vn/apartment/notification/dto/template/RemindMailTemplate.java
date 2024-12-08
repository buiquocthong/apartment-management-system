package vn.apartment.notification.dto.template;

public enum RemindMailTemplate {
    REMIND_INVOICE_TEMPLATE("INVOICE_REMIND_PAYMENT_EN");

    private final String id;

    RemindMailTemplate(String templateId) {
        this.id = templateId;
    }

    public String id() {
        return id;
    }
}
