package vn.apartment.identity.interactor.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import vn.apartment.apartment.core.utils.Generators;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.core.mvc.security.encoder.PasswordGenerator;
import vn.apartment.core.redis.publisher.RedisEventPublisher;
import vn.apartment.identity.dto.auth.ResetPassword;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.entity.UserInfo;
import vn.apartment.identity.mapper.UserMapper;
import vn.apartment.identity.service.UserService;
import vn.apartment.identity.util.Locales;
import vn.apartment.notification.dto.event.MailEvent;
import vn.apartment.notification.dto.mail.MailDTO;
import vn.apartment.notification.dto.mail.Priority;
import vn.apartment.notification.dto.template.ResetPwMailTemplate;

import java.util.Locale;

@Interactor
public class ForgetPassword {

    private static final Logger LOG = LoggerFactory.getLogger(ForgetPassword.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private PasswordGenerator passwordGenerator;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private RedisEventPublisher publisher;

    public void execute(ResetPassword resetPassword) {

        if (resetPassword.getEmail() == null) {
            throw new InvalidParameterException("The request body is missing.");
        }

        String rawPw = passwordGenerator.generate();
        LOG.info("Generated raw password: {}", rawPw);
        User hadUser = saveNewPassword(resetPassword.getEmail(), rawPw);

        sendMail(hadUser, rawPw);

    }

    private void sendMail(User hadUser, String rawPw) {

        UserInfo info = hadUser.getUserInfo();

        String username = hadUser.getAuth().getUsername();

        try {
            MailDTO mail = makeNewMail(rawPw, info, username);
            MailEvent event = newEvent(mail);
            publisher.publish(event);
            LOG.info("Published the mail message {} .", event.getId());

        } catch (Exception exception) {
            LOG.error("Couldn't send mail", exception);
        }
    }

    private MailEvent newEvent(MailDTO mail) {
        MailEvent event = MailEvent.standard();
        event.setId(Generators.uuid());
        event.setPayload(mail);
        event.setSource("identity");
        event.setType("RESET_PASSWORD");
        return event;
    }

    private MailDTO makeNewMail(String rawPw, UserInfo info, String username) {
        return MailDTO.mail()
                .tos(info.getEmail())
                .priority(Priority.HIGHEST)
                .subject(getSubject(username))
                .templateId(ResetPwMailTemplate.RESET_PASSWORD_TEMPLATE.id())
                .parameter("username", username)
                .parameter("password", rawPw)
                .parameter("first", getValue(info.getFirst(), username))
                .parameter("last", getValue(info.getLast(), ""));
    }

    private String getValue(String value, String defValue) {
        return ObjectUtils.isEmpty(value) ? defValue : value;
    }

    private String getSubject(String username) {
        return messageSource.getMessage(Locales.MAIL_USER_ACTIVATION,
                new String[]{username}, Locale.ENGLISH);
    }

    @Transactional
    public User saveNewPassword(String email, String rawNewPw) {
        User hadUser = userService.findByEmail(email);
        User hadUserWithAuth = userService.findByUserIdWithAuth(hadUser.getUserId());
        hadUserWithAuth.getAuth().setPassword(passwordEncoder.encode(rawNewPw));
        return userService.saveOrUpdate(hadUserWithAuth);
    }
}
