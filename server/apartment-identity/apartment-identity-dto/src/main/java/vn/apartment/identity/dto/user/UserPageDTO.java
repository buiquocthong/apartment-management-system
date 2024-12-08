package vn.apartment.identity.dto.user;

import io.swagger.v3.oas.annotations.media.Schema;
import vn.apartment.core.model.api.ApiPage;

import java.util.List;


@Schema(name = "User Page")
public class UserPageDTO extends ApiPage<UserDTO> {

    public UserPageDTO(long total, List<UserDTO> items) {
        super(total, items);
    }
}
