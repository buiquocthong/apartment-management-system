package vn.apartment.identity.interactor.user;

import java.util.Locale;
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
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.dto.user.UserResultDTO;
import vn.apartment.identity.entity.Auth;
import vn.apartment.identity.entity.Role;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.entity.UserInfo;
import vn.apartment.identity.mapper.UserMapper;
import vn.apartment.identity.service.RoleService;
import vn.apartment.identity.service.UserService;
import vn.apartment.identity.util.Locales;
import vn.apartment.notification.dto.event.MailEvent;
import vn.apartment.notification.dto.mail.MailDTO;
import vn.apartment.notification.dto.template.IdentityMailTemplate;
import vn.apartment.notification.dto.mail.Priority;
@Interactor
public class AddUser {

    private static final Logger LOG = LoggerFactory.getLogger(AddUser.class);

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RoleService roleService;

    @Autowired
    private PasswordGenerator passwordGenerator;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MessageSource messageSource;

    @Autowired
    private RedisEventPublisher publisher;

    public UserResultDTO execute(UserDTO userDTO) {

        if (userDTO == null) {
            throw new InvalidParameterException("The request body is missing.");
        }

        userService.checkExistByUsername(userDTO.getUsername());

        String rawPw = passwordGenerator.generate();
        LOG.info("Generated raw password: {}", rawPw);
        User newUser = saveNewUser(userDTO, rawPw);

        sendMail(newUser, rawPw);

        return new UserResultDTO(newUser.getUserId());
    }

    private void sendMail(User newUser, String rawPw) {

        UserInfo info = newUser.getUserInfo();
        String username = newUser.getAuth().getUsername();

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
        event.setType("ADD_NEW_USER");
        return event;
    }

    private MailDTO makeNewMail(String rawPw, UserInfo info, String username) {
        return MailDTO.mail()
            .tos(info.getEmail())
            .priority(Priority.HIGHEST)
            .subject(getSubject(username))
            .templateId(IdentityMailTemplate.ADD_USER_TEMPLATE.id())
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
    public User saveNewUser(UserDTO userDTO, String rawPw) {
        User newUser = userMapper.toEntity(userDTO);
        newUser.setUserId(Generators.uuid());

        Role role = roleService.findByLabel(userDTO.getRole().getLabel());
        newUser.setRole(role);

        Auth auth = new Auth();
        auth.setUsername(userDTO.getUsername());
        auth.setPassword(passwordEncoder.encode(rawPw));
        newUser.setAuth(auth);

        return userService.saveOrUpdate(newUser);
    }
}
