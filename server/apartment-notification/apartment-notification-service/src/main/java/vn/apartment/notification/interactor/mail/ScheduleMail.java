package vn.apartment.notification.interactor.mail;

import java.util.Date;

import com.google.common.collect.Sets;
import org.apache.commons.lang3.ObjectUtils;

import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;

import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.notification.document.Mail;
import vn.apartment.notification.document.Template;
import vn.apartment.notification.dto.mail.MailDTO;
import vn.apartment.notification.dto.mail.MailResult;
import vn.apartment.notification.job.MailJob;
import vn.apartment.notification.props.NotificationProperties;
import vn.apartment.notification.service.MailService;
import vn.apartment.notification.service.TemplateService;

@Interactor
public class ScheduleMail {

    private static final Logger LOG = LoggerFactory.getLogger(ScheduleMail.class);

    @Autowired
    private Scheduler scheduler;

    @Autowired
    private MailService mailService;

    @Autowired
    private TemplateService templateService;

    @Autowired
    private NotificationProperties notificationProperties;

    public MailResult execute(MailDTO mailDTO) {

        if (!mailDTO.isValid()) {
            throw new InvalidParameterException("The mail payload is not valid.");
        }

        Mail mail = storeMail(mailDTO);

        scheduleMailJob(mail);

        return new MailResult(mail.getId(), mail.getStatus());
    }

    private Mail storeMail(MailDTO mailDTO) {
        Template template = templateService.findById(mailDTO.getTemplateId());
        Mail mail = newMail(mailDTO, template);
        mailService.saveOrUpdate(mail);
        return mail;
    }

    private void scheduleMailJob(Mail mail) {
        try {
            scheduler.scheduleJob(newMailJob(mail), newTriggerStartNow());
        } catch (SchedulerException ex) {
            LOG.error("Couldn't schedule mail {}.", mail.getId(), ex);
        }
    }

    private JobDetail newMailJob(Mail mail) {
        JobDataMap jobDataMap = new JobDataMap();
        jobDataMap.put(MailJob.MAIL_ID_KEY, mail.getId());
        return JobBuilder.newJob(MailJob.class)
            .withDescription("mail-job")
            .usingJobData(jobDataMap)
            .build();
    }

    private Trigger newTriggerStartNow() {
        return TriggerBuilder.newTrigger()
            .withDescription("mail-job-trigger")
            .startNow()
            .build();
    }

    private Mail newMail(MailDTO mailDTO, Template template) {
        Mail mail = new Mail();
        setDefaultSetting(mailDTO, mail);

        Date now = Dates.now();
        mail.setCreatedOn(now);
        mail.setUpdatedOn(now);
        mail.setId(Generators.uuid());
        mail.setTo(mailDTO.getTo());
        mail.setCc(mailDTO.getCc());

        mail.setSubject(mailDTO.getSubject());
        mail.setTemplate(template);
        mail.setPriority(mailDTO.getPriority());
        mail.setParameters(mailDTO.getParameters());
        return mail;
    }

    private void setDefaultSetting(MailDTO mailDTO, Mail mail) {
        NotificationProperties.Email defaultEmail = notificationProperties.getEmail();
        mail.setFrom(defaultEmail.getFrom());
        mail.setBcc(mailDTO.getBcc());
        if (ObjectUtils.isNotEmpty(defaultEmail.getBcc())) {
            if (mail.getBcc() == null) {
                mail.setBcc(Sets.newHashSet());
            }
            mail.getBcc().addAll(defaultEmail.getBcc());
        }
    }
}
