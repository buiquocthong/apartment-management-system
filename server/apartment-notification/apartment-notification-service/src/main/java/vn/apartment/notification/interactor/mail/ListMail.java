package vn.apartment.notification.interactor.mail;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;

import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.notification.document.Mail;
import vn.apartment.notification.dto.mail.*;
import vn.apartment.notification.service.MailService;


@Interactor
public class ListMail {

    @Autowired
    private MailService mailService;

    public MailPageDTO execute(MailQuery mailQuery) {

        Page<Mail> pageResult = mailService.findMatchingMails(mailQuery);

        List<MailDTO> dtos = pageResult.get()
            .map(ListMail::toDTO)
            .collect(Collectors.toList());

        return new MailPageDTO(pageResult.getTotalElements(), dtos);
    }

    private static MailDTO toDTO(Mail mail) {
        MailDTO dto = new MailDTO();
        dto.setId(mail.getId());
        dto.setSubject(mail.getSubject());

        dto.setTo(mail.getTo());
        dto.setCc(mail.getCc());
        dto.setBcc(mail.getBcc());

        dto.setPriority(mail.getPriority());
        dto.setStatus(mail.getStatus());
        dto.setError(mail.getError());
        dto.setRetryTimes(mail.getRetryTimes());
        dto.setUpdatedOn(mail.getUpdatedOn());
        dto.setParameters(mail.getParameters());
        dto.setSentDate(mail.getSentDate());

        return dto;
    }
}
