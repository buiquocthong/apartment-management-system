package vn.apartment.identity.interactor.user;

import org.springframework.beans.factory.annotation.Autowired;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.role.SimpleRoleDTO;
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.entity.Role;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.entity.UserInfo;
import vn.apartment.identity.mapper.UserInfoMapper;
import vn.apartment.identity.service.RoleService;
import vn.apartment.identity.service.UserService;


@Interactor
public class UpdateUser {

    @Autowired
    private UserService userService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserInfoMapper userInfoMapper;

    @AuditAction("UPDATE_USER")
    public void execute(UserDTO userDTO) {

        User hadUser = userService.findByUserId(userDTO.getUserId());

        SimpleRoleDTO roleDto = userDTO.getRole();
        Role role = hadUser.getRole();

        if (roleDto != null && !role.getLabel()
            .equalsIgnoreCase(roleDto.getLabel())) {
            hadUser.setRole(roleService.findByLabel(roleDto.getLabel()));
        }

        UserInfo userInfo = hadUser.getUserInfo();
        userInfoMapper.update(userDTO.getUserInfo(), userInfo);

        userService.saveOrUpdate(hadUser);
    }
}
