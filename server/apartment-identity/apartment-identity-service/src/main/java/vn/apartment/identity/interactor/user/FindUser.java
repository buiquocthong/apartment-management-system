package vn.apartment.identity.interactor.user;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;
import vn.apartment.core.model.exception.InvalidParameterException;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.mapper.UserMapper;
import vn.apartment.identity.service.UserService;


@Interactor
public class FindUser {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserDTO execute(String identifier) {

        if (ObjectUtils.isEmpty(identifier)) {
            throw new InvalidParameterException("Missing an identifier on request");
        }

        return userMapper.toDTO(userService.findByUserId(identifier));
    }
}
