package vn.apartment.identity.dao;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import vn.apartment.identity.entity.Resource;
import vn.apartment.identity.entity.RoleResource;


@Repository
public interface ResourceRepo extends JpaRepository<Resource, Long> {

    @Query("SELECT ru FROM User u JOIN u.role r "
        + "JOIN r.roleResources ru JOIN FETCH ru.resource "
        + "WHERE u.userId = :userId")
    List<RoleResource> findUserResources(String userId);

    Optional<Resource> findByResourceId(String resourceId);
}
