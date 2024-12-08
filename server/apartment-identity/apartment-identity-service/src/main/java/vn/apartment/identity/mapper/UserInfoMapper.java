package vn.apartment.identity.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import vn.apartment.identity.dto.user.UserInfoDTO;
import vn.apartment.identity.entity.UserInfo;

@Mapper(componentModel = "spring")
public interface UserInfoMapper extends ModelMapper<UserInfo, UserInfoDTO> {

    void update(UserInfoDTO dto, @MappingTarget UserInfo entity);
}
