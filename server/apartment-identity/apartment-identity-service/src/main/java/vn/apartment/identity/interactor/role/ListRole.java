package vn.apartment.identity.interactor.role;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.mvc.anotation.Interactor;
import vn.apartment.identity.dto.role.RoleDTO;
import vn.apartment.identity.mapper.RoleMapper;
import vn.apartment.identity.service.RoleService;


@Interactor
public class ListRole {

    @Autowired
    private RoleService roleService;
    @Autowired
    private RoleMapper roleMapper;

    @Transactional(readOnly = true)
    public List<RoleDTO> execute() {

        return roleService.findRoles()
            .stream().map(roleMapper::toDTO)
            .collect(Collectors.toList());
    }

}
