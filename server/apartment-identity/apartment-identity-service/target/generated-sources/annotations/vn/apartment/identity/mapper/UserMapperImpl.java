package vn.apartment.identity.mapper;

import javax.annotation.processing.Generated;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import vn.apartment.identity.dto.role.SimpleRoleDTO;
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.entity.Auth;
import vn.apartment.identity.entity.Role;
import vn.apartment.identity.entity.User;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:15+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Autowired
    private UserInfoMapper userInfoMapper;

    @Override
    public UserDTO toDTO(User entity) {
        if ( entity == null ) {
            return null;
        }

        UserDTO userDTO = new UserDTO();

        userDTO.setUsername( entityAuthUsername( entity ) );
        userDTO.setCreatedAt( entity.getCreatedAt() );
        userDTO.setRole( roleToSimpleRoleDTO( entity.getRole() ) );
        userDTO.setStatus( entity.getStatus() );
        userDTO.setUpdatedAt( entity.getUpdatedAt() );
        userDTO.setUserId( entity.getUserId() );
        userDTO.setUserInfo( userInfoMapper.toDTO( entity.getUserInfo() ) );

        return userDTO;
    }

    @Override
    public User toEntity(UserDTO dto) {
        if ( dto == null ) {
            return null;
        }

        User user = new User();

        user.setUserId( dto.getUserId() );
        user.setStatus( dto.getStatus() );
        user.setUserInfo( userInfoMapper.toEntity( dto.getUserInfo() ) );

        return user;
    }

    private String entityAuthUsername(User user) {
        if ( user == null ) {
            return null;
        }
        Auth auth = user.getAuth();
        if ( auth == null ) {
            return null;
        }
        String username = auth.getUsername();
        if ( username == null ) {
            return null;
        }
        return username;
    }

    protected SimpleRoleDTO roleToSimpleRoleDTO(Role role) {
        if ( role == null ) {
            return null;
        }

        SimpleRoleDTO simpleRoleDTO = new SimpleRoleDTO();

        simpleRoleDTO.setDescription( role.getDescription() );
        simpleRoleDTO.setLabel( role.getLabel() );
        simpleRoleDTO.setRoleId( role.getRoleId() );

        return simpleRoleDTO;
    }
}
