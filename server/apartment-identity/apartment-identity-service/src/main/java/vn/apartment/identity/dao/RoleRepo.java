package vn.apartment.identity.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import vn.apartment.identity.entity.Role;


@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {

    Optional<Role> findByRoleId(String roleId);
    Optional<Role> findByLabel(String label);
}
