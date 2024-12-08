package vn.apartment.notification.changelog;

import java.io.IOException;
import java.util.Date;

import com.github.cloudyrock.mongock.ChangeLog;
import com.github.cloudyrock.mongock.ChangeSet;
import com.github.cloudyrock.mongock.driver.mongodb.springdata.v3.decorator.impl.MongockTemplate;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.notification.document.Template;
import vn.apartment.notification.dto.template.IdentityMailTemplate;
import vn.apartment.notification.dto.template.InvoiceMailTemplate;
import vn.apartment.notification.dto.template.RemindMailTemplate;
import vn.apartment.notification.dto.template.ResetPwMailTemplate;

@ChangeLog(order = "1")
public class TemplateChangeLog extends BaseChangelog {

    private static final String CREATE_USER_TEMPLATE =
        IdentityMailTemplate.ADD_USER_TEMPLATE.id();
    private static final String RESET_PASSWORD_TEMPLATE =
            ResetPwMailTemplate.RESET_PASSWORD_TEMPLATE.id();
    private static final String CREATE_INVOICE_TEMPLATE =
            InvoiceMailTemplate.ADD_INVOICE_TEMPLATE.id();
    private static final String REMIND_PAYMENT_TEMPLATE =
            RemindMailTemplate.REMIND_INVOICE_TEMPLATE.id();

    @ChangeSet(id = "IDENTITY.CREATE_USER_TEMPLATE_EN.001", order = "001", author = "21110778@student.hcmute.edu.vn")
    public void addIdentityCreateUserEnTemplate(MongockTemplate mongoTemplate) throws IOException {
        Date now = Dates.now();
        Template template = new Template();
        template.setId(CREATE_USER_TEMPLATE);
        template.setServiceId(IDENTITY_SERVICE);
        template.setVersion(FIRST_VERSION);
        template.setLanguage(EN_LANG);
        template.setCreatedAt(now);
        template.setUpdatedAt(now);
        template.setContent(readFileContent(getIdentityTemplate(CREATE_USER_TEMPLATE)));
        mongoTemplate.insert(template, DB_COLLECTION);
    }

    @ChangeSet(id = "IDENTITY.RESET_PASSWORD_TEMPLATE_EN.002", order = "002", author = "21110778@student.hcmute.edu.vn")
    public void addIdentityResetPwEnTemplate(MongockTemplate mongoTemplate) throws IOException {
        Date now = Dates.now();
        Template template = new Template();
        template.setId(RESET_PASSWORD_TEMPLATE);
        template.setServiceId(IDENTITY_SERVICE);
        template.setVersion(FIRST_VERSION);
        template.setLanguage(EN_LANG);
        template.setCreatedAt(now);
        template.setUpdatedAt(now);
        template.setContent(readFileContent(getPasswordTemplate(RESET_PASSWORD_TEMPLATE)));
        mongoTemplate.insert(template, DB_COLLECTION);
    }

    @ChangeSet(id = "INVOICE.CREATE_INVOICE_TEMPLATE_EN.003", order = "003", author = "21110778@student.hcmute.edu.vn")
    public void addInvoiceCreateInvoiceEnTemplate(MongockTemplate mongoTemplate) throws IOException {
        Date now = Dates.now();
        Template template = new Template();
        template.setId(CREATE_INVOICE_TEMPLATE);
        template.setServiceId(INVOICE_SERVICE);
        template.setVersion(FIRST_VERSION);
        template.setLanguage(EN_LANG);
        template.setCreatedAt(now);
        template.setUpdatedAt(now);
        template.setContent(readFileContent(getInvoiceTemplate(CREATE_INVOICE_TEMPLATE)));
        mongoTemplate.insert(template, DB_COLLECTION);
    }

    @ChangeSet(id = "INVOICE.REMIND_PAYMENT_TEMPLATE_EN.004", order = "004", author = "21110778@student.hcmute.edu.vn")
    public void addInvoiceRemindPaymentEnTemplate(MongockTemplate mongoTemplate) throws IOException {
        Date now = Dates.now();
        Template template = new Template();
        template.setId(REMIND_PAYMENT_TEMPLATE);
        template.setServiceId(INVOICE_SERVICE);
        template.setVersion(FIRST_VERSION);
        template.setLanguage(EN_LANG);
        template.setCreatedAt(now);
        template.setUpdatedAt(now);
        template.setContent(readFileContent(getReminderTemplate(REMIND_PAYMENT_TEMPLATE)));
        mongoTemplate.insert(template, DB_COLLECTION);
    }
}
