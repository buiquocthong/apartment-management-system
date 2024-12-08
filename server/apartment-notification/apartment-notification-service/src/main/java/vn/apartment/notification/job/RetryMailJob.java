package vn.apartment.notification.job;

import java.util.List;

import org.apache.commons.lang3.ObjectUtils;
import org.quartz.Job;
import org.quartz.JobExecutionContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;

import vn.apartment.notification.document.Mail;
import vn.apartment.notification.props.NotificationProperties;
import vn.apartment.notification.service.MailSenderService;
import vn.apartment.notification.service.MailService;


public class RetryMailJob implements Job {

    private static final Logger LOG = LoggerFactory.getLogger(RetryMailJob.class);

    @Autowired
    private MailService mailService;

    @Autowired
    private MailSenderService mailSenderService;

    @Autowired
    private NotificationProperties notificationProperties;

    @Override
    public void execute(JobExecutionContext context) {

        List<Mail> mails = mailService.findRetryMails(getMaxRetryTimes());

        if (ObjectUtils.isEmpty(mails)) {
            LOG.debug("No mail need to retry.");
            return;
        }

        LOG.info("There were {} mail(s) need to retry.", mails.size());

        mails.stream()
            .forEach((mail) -> {
                LOG.info("Retrying the mail id={}, status={}, retry-time={} .",
                    mail.getId(), mail.getStatus(), mail.getRetryTimes());

                mailSenderService.send(mail);

                LOG.info("Retried the mail id={} .", mail.getId());
            });

        LOG.info("Completed retry mails.");
    }

    private int getMaxRetryTimes() {
        return notificationProperties.getEmail()
            .getMaxRetryTimes();
    }
}
