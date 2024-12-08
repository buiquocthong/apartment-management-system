package vn.apartment.notification.dto.template;

public enum InvoiceMailTemplate {
    ADD_INVOICE_TEMPLATE("INVOICE_CREATE_INVOICE_EN");

    private final String id;

    InvoiceMailTemplate(String templateId) {
        this.id = templateId;
    }

    public String id() {
        return id;
    }
}
