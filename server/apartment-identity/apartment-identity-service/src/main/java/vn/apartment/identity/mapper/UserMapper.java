package vn.apartment.identity.mapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;
import vn.apartment.identity.dto.user.UserDTO;
import vn.apartment.identity.entity.User;

@Mapper(componentModel = "spring", uses = {UserInfoMapper.class})
public interface UserMapper extends ModelMapper<User, UserDTO> {

    @Mappings({
        @Mapping(source = "auth.username", target = "username")
    })
    UserDTO toDTO(User entity);

    @Mappings({
        @Mapping(target = "role", ignore = true),
        @Mapping(target = "auth", ignore = true),
        @Mapping(target = "createdAt", ignore = true),
        @Mapping(target = "updatedAt", ignore = true),
    })
    User toEntity(UserDTO dto);
}
