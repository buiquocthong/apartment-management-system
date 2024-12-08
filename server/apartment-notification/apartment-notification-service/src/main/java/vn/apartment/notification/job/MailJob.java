package vn.apartment.notification.job;

import java.io.IOException;

import freemarker.template.Configuration;
import freemarker.template.TemplateException;

import org.apache.commons.lang3.ObjectUtils;

import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.notification.document.Mail;
import vn.apartment.notification.document.Template;
import vn.apartment.notification.dto.enums.MailStatus;
import vn.apartment.notification.service.MailSenderService;
import vn.apartment.notification.service.MailService;

@Service
public class MailJob implements Job {

    private static final Logger LOG = LoggerFactory.getLogger(MailJob.class);
    public static final String MAIL_ID_KEY = "MAIL_ID";

    @Autowired
    private Configuration freemarkerCfg;

    @Autowired
    private MailService mailService;

    @Autowired
    private MailSenderService mailSenderService;

    @Override
    public void execute(JobExecutionContext context) {

        final String mailId = context.getJobDetail()
            .getJobDataMap().getString(MAIL_ID_KEY);

        if (ObjectUtils.isEmpty(mailId)) {
            throw new IllegalArgumentException("The mail job key is not provided.");
        }

        LOG.info("Execute the job {} .", mailId);

        Mail mail = null;

        try {

            mail = mailService.findById(mailId);

            mail.setContent(buildContent(mail, mail.getTemplate()));

            mailSenderService.send(mail);

        } catch (Exception ex) {

            LOG.error("Executed mail-job {} on failure.", mailId, ex);

            if (mail != null) {
                mail.setError(ex.getMessage());
                updateAllFailureMail(mail);
            }

        } finally {
            LOG.info("Executed the mail job {} .", mailId);
        }
    }

    private void updateAllFailureMail(Mail mail) {
        mail.setRetry(false);
        mail.setUpdatedOn(Dates.now());
        mail.setStatus(MailStatus.FAILED);
        mailService.saveOrUpdate(mail);
    }

    private String buildContent(Mail mail, Template template) throws IOException,
        TemplateException {
        return FreeMarkerTemplateUtils
            .processTemplateIntoString(freemarkerCfg.getTemplate(template.getId()),
                mail.getParameters());
    }

}
