package vn.apartment.identity.mapper;

import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;
import vn.apartment.identity.dto.user.UserInfoDTO;
import vn.apartment.identity.entity.UserInfo;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-12-08T09:49:14+0700",
    comments = "version: 1.4.2.Final, compiler: Eclipse JDT (IDE) 3.40.0.z20241112-1021, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class UserInfoMapperImpl implements UserInfoMapper {

    @Override
    public UserInfoDTO toDTO(UserInfo entity) {
        if ( entity == null ) {
            return null;
        }

        UserInfoDTO userInfoDTO = new UserInfoDTO();

        userInfoDTO.setCountry( entity.getCountry() );
        userInfoDTO.setEmail( entity.getEmail() );
        userInfoDTO.setFirst( entity.getFirst() );
        userInfoDTO.setLast( entity.getLast() );
        userInfoDTO.setMiddle( entity.getMiddle() );
        userInfoDTO.setPhone( entity.getPhone() );
        userInfoDTO.setPrefix( entity.getPrefix() );

        return userInfoDTO;
    }

    @Override
    public UserInfo toEntity(UserInfoDTO dto) {
        if ( dto == null ) {
            return null;
        }

        UserInfo userInfo = new UserInfo();

        userInfo.setEmail( dto.getEmail() );
        userInfo.setFirst( dto.getFirst() );
        userInfo.setLast( dto.getLast() );
        userInfo.setMiddle( dto.getMiddle() );
        userInfo.setPrefix( dto.getPrefix() );
        userInfo.setPhone( dto.getPhone() );
        userInfo.setCountry( dto.getCountry() );

        return userInfo;
    }

    @Override
    public void update(UserInfoDTO dto, UserInfo entity) {
        if ( dto == null ) {
            return;
        }

        entity.setEmail( dto.getEmail() );
        entity.setFirst( dto.getFirst() );
        entity.setLast( dto.getLast() );
        entity.setMiddle( dto.getMiddle() );
        entity.setPrefix( dto.getPrefix() );
        entity.setPhone( dto.getPhone() );
        entity.setCountry( dto.getCountry() );
    }
}
