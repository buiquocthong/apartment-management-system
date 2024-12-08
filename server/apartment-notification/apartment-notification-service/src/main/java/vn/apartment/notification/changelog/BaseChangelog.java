package vn.apartment.notification.changelog;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class BaseChangelog {

    private static final Logger LOG = LoggerFactory.getLogger(BaseChangelog.class);
    String DB_COLLECTION = "template";
    String FREE_MARKER_EXTENSION = ".ftl";
    String TEMPLATE_RESOURCE = "templates";
    String EN_LANG = "en";
    String FIRST_VERSION = "1.0";
    String IDENTITY_SERVICE = "identity";
    String TEMPLATE_IDENTITY_PATH = TEMPLATE_RESOURCE + "/" + IDENTITY_SERVICE;
    String TEMPLATE_PASSWORD_PATH = TEMPLATE_RESOURCE + "/" + IDENTITY_SERVICE;

    String INVOICE_SERVICE = "invoice";
    String TEMPLATE_INVOICE_PATH = TEMPLATE_RESOURCE + "/" + INVOICE_SERVICE;
    String TEMPLATE_REMIND_PATH = TEMPLATE_RESOURCE + "/" + INVOICE_SERVICE;

    public String readFileContent(String path) throws IOException {
        LOG.info("Attempting to read file: {}", path);
        try (InputStream inputStream = getClass().getClassLoader().getResourceAsStream(path)) {
            if (inputStream == null) {
                LOG.error("Resource not found: {}", path);
                throw new IOException("Resource not found: " + path);
            }
            String content = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
            LOG.info("Successfully read file: {}", path);
            return content;
        } catch (IOException e) {
            LOG.error("Couldn't read file: {}", path, e);
            throw e;
        }
    }

    protected String getIdentityTemplate(String id) {
        return TEMPLATE_IDENTITY_PATH + "/" + id + FREE_MARKER_EXTENSION;
    }

    protected String getPasswordTemplate(String id) {
        return TEMPLATE_PASSWORD_PATH + "/" + id + FREE_MARKER_EXTENSION;
    }

    protected String getInvoiceTemplate(String id) {
        return TEMPLATE_INVOICE_PATH + "/" + id + FREE_MARKER_EXTENSION;
    }

    protected String getReminderTemplate(String id) {
        return TEMPLATE_REMIND_PATH + "/" + id + FREE_MARKER_EXTENSION;
    }
}
