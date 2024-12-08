package vn.apartment.identity.interactor.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.dto.user.UserPageDTO;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.mapper.UserMapper;
import vn.apartment.identity.service.UserService;

import java.util.List;
import java.util.stream.Collectors;

@Interactor
public class ListUser {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;

    @Transactional(readOnly = true)
    public UserPageDTO execute(ApiQuery apiQuery) {
        Page<User> pageResult = userService.findMatchingUsers(apiQuery);
        List<UserDTO> dtos = pageResult.get()
            .map(userMapper::toDTO)
            .collect(Collectors.toList());
        return new UserPageDTO(pageResult.getTotalElements(), dtos);
    }
}
