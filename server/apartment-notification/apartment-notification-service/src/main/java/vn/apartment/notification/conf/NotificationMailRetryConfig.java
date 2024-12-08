package vn.apartment.notification.conf;

import org.quartz.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.event.EventListener;
import vn.apartment.notification.job.RetryMailJob;

@Configuration
public class NotificationMailRetryConfig {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationMailRetryConfig.class);
    private static final JobKey RETRY_JOB = JobKey.jobKey("retry-mail-job", "mail-group");

    @Autowired
    private Scheduler scheduler;

    @EventListener(ApplicationReadyEvent.class)
    public void registerRetryMailJob() {
        try {
            LOG.info("Register the retry mail job.");
            scheduler.scheduleJob(newMailJob(), newTriggerWithInterval());
        } catch (SchedulerException ex) {
            LOG.error("Couldn't register the retry mail job.", ex);
        }
    }

    private JobDetail newMailJob() {
        return JobBuilder.newJob(RetryMailJob.class)
            .withDescription("retry-mail-job")
            .withIdentity(RETRY_JOB)
            .build();
    }

    private Trigger newTriggerWithInterval() {
        return TriggerBuilder.newTrigger()
            .withDescription("retry-mail-job-trigger")
            .withSchedule(SimpleScheduleBuilder.simpleSchedule()
                .withIntervalInMinutes(1)
                .repeatForever())
            .build();
    }
}
