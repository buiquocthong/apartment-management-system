package vn.apartment.identity.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.apartment.core.model.exception.ResourceAlreadyExistedException;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.identity.dao.RoleRepo;
import vn.apartment.identity.entity.Role;


@Service
public class RoleService {

    @Autowired
    private RoleRepo roleRepo;

    public Role saveOrUpdate(Role role) {
        return roleRepo.save(role);
    }

    public Role findByRoleId(final String roleId) {
        Optional<Role> hadRole = roleRepo.findByRoleId(roleId);
        if (!hadRole.isPresent()) {
            throw new ResourceNotFoundException("The role by " + roleId + " not found.");
        }
        return hadRole.get();
    }

    public Role findByLabel(final String label) {
        Optional<Role> hadRole = retrieveByLabel(label);
        if (!hadRole.isPresent()) {
            throw new ResourceNotFoundException("The role by " + label + " not found.");
        }
        return hadRole.get();
    }

    public Optional<Role> retrieveByLabel(final String label) {
        return roleRepo.findByLabel(label);
    }

    public List<Role> findRoles() {
        return roleRepo.findAll();
    }

    public void checkExistByLabel(String label) {
        Optional<Role> hadRole = retrieveByLabel(label);
        if (hadRole.isPresent()) {
            throw new ResourceAlreadyExistedException("The role by " + label + " already existed.");
        }
    }

}
