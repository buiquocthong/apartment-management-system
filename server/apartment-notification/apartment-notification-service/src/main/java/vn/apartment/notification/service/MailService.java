package vn.apartment.notification.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mongdb.aggregate.AggregationRepository;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.notification.dao.MailRepo;
import vn.apartment.notification.document.Mail;
import vn.apartment.notification.dto.enums.MailStatus;
import vn.apartment.notification.dto.mail.MailQuery;

import static org.springframework.data.mongodb.core.query.Criteria.where;


@Service
public class MailService {

    @Autowired
    private MailRepo mailRepo;
    @Autowired
    private AggregationRepository aggregationRepository;

    private static final Map<String, String> SUPPORT_SORTED = Maps.newHashMap();
    static {
        SUPPORT_SORTED.put("to", "to");
        SUPPORT_SORTED.put("status", "status");
        SUPPORT_SORTED.put("priority", "priority");
        SUPPORT_SORTED.put("subject", "subject");
        SUPPORT_SORTED.put("retry_times", "retryTimes");
        SUPPORT_SORTED.put("updated_on", "updatedOn");
        SUPPORT_SORTED.put("sent_date", "sentDate");
    }

    public Mail saveOrUpdate(Mail mail) {
        return mailRepo.save(mail);
    }

    public Mail findById(String id) {

        Optional<Mail> hadMail = mailRepo.findById(id);

        if (!hadMail.isPresent()) {
            throw new ResourceNotFoundException("The mail by " + id + " not found.");
        }

        return hadMail.get();
    }
    public List<Mail> findRetryMails(int maxRetryTimes) {
        return mailRepo.findMailRetry(maxRetryTimes,
            Lists.newArrayList(MailStatus.FAILED));
    }
    public Page<Mail> findMatchingMails(MailQuery mailQuery) {

        Pageable pageable = PageableUtils.of(mailQuery, () -> SUPPORT_SORTED);
        final String keyword = mailQuery.getQuery();

        if (ObjectUtils.isEmpty(keyword)) {
            return mailRepo.findAll(pageable);
        }

        Criteria criteria = new Criteria()
            .orOperator(
                where("from").regex(keyword, "i"),
                where("to").regex(keyword, "i"),
                where("cc").regex(keyword, "i"),
                where("priority").regex(keyword, "i"),
                where("subject").regex(keyword, "i"),
                where("status").regex(keyword, "i"),
                where("sentDate").regex(keyword, "i"));

        return aggregationRepository.findAll(criteria, pageable, Mail.class);
    }
}

