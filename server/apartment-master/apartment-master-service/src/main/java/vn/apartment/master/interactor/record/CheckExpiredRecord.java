package vn.apartment.master.interactor.record;

import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.master.service.RecordService;

import java.util.Date;

@Interactor
public class CheckExpiredRecord {
    private static final Logger LOG = LoggerFactory.getLogger(CheckExpiredRecord.class);
    @Autowired
    private RecordService recordService;
    @Autowired
    private RemoveRecord removeRecord;

    @Scheduled(cron = "0 0 0 * * *")
    public void execute() {
        LOG.info("Starting check expired records job");
        Date today = new Date();
        recordService.getActiveRecords()
                .stream()
                .filter(record -> DateUtils.isSameDay(record.getEndDate(), today))
                .forEach(record -> {
                    removeRecord.execute(record.getRecordId());
                    LOG.debug("Marking record {} as deleted", record.getRecordId());
                });
    }

}
