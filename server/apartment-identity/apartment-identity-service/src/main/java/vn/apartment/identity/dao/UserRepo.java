package vn.apartment.identity.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import vn.apartment.identity.entity.User;


@Repository
public interface UserRepo extends JpaRepository<User, Long>, JpaSpecificationExecutor<User> {

    @Query("SELECT u FROM User u JOIN u.auth au WHERE au.username = :username")
    Optional<User> findByUsername(String username);
    Optional<User> findByUserId(String userId);
    @Query("SELECT u FROM User u JOIN u.userInfo ui WHERE ui.email = :email")
    Optional<User> findByEmail(String email);
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.auth WHERE u.userId = :userId")
    Optional<User> findByUserIdWithAuth(@Param("userId") String userId);
}
