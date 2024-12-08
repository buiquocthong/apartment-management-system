package vn.apartment.notification.dao;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import vn.apartment.notification.document.Mail;
import vn.apartment.notification.dto.enums.MailStatus;

@Repository
public interface MailRepo extends MongoRepository<Mail, String> {

    @Query(value = "{ 'isRetry': true, 'retryTimes': {$lte: ?0}, 'status': {$in: ?1} }")
    List<Mail> findMailRetry(int maxRetryTimes, List<MailStatus> statuses);

}
