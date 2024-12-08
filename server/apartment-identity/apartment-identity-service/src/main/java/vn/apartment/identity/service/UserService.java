package vn.apartment.identity.service;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.exception.ResourceAlreadyExistedException;
import vn.apartment.core.model.exception.ResourceNotFoundException;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.identity.dao.UserRepo;
import vn.apartment.identity.entity.User;

import static vn.apartment.identity.dao.spec.UserQuerySpec.newSpecification;
import static vn.apartment.identity.dao.spec.UserQuerySpec.supportedFields;

@Service
public class UserService {

    private static final Logger LOG = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepo userRepo;

    public User saveOrUpdate(User user) {
        return userRepo.save(user);
    }

    public User findByUserId(final String userId) {
        Optional<User> hadUser = retrieveByUserId(userId);
        if (!hadUser.isPresent()) {
            throw new ResourceNotFoundException("The user by " + userId + " not found.");
        }
        return hadUser.get();
    }

    public void checkExistByUsername(String username) {
        Optional<User> hadUser = retrieveByUsername(username);
        if (hadUser.isPresent()) {
            throw new ResourceAlreadyExistedException("The user by " + username + " already existed.");
        }
    }

    public User findByEmail(final String email) {
        Optional<User> hadUser = retrieveByEmail(email);
        if (!hadUser.isPresent()) {
            throw new ResourceNotFoundException("The user by " + email + " not found.");
        }
        return hadUser.get();
    }

    @Transactional(readOnly = true)
    public User findByUserIdWithAuth(String userId) {
        Optional<User> hadUser = retrieveByUserIdWithAuth(userId);
        if (!hadUser.isPresent()) {
            throw new ResourceNotFoundException("The user by " + userId + " not found.");
        }
        return hadUser.get();
    }

    public Optional<User> retrieveByUserId(final String userId) {
        return userRepo.findByUserId(userId);
    }

    public Optional<User> retrieveByUsername(final String username) {
        return userRepo.findByUsername(username);
    }

    public Optional<User> retrieveByEmail(final String email) {
        return userRepo.findByEmail(email);
    }

    public Optional<User> retrieveByUserIdWithAuth(final String userId) {
        return userRepo.findByUserIdWithAuth(userId);
    }

    public Page<User> findMatchingUsers(ApiQuery apiQuery) {
        if (apiQuery == null) {
            return Page.empty();
        }
        return userRepo.findAll(newSpecification(apiQuery), PageableUtils.of(apiQuery, supportedFields()));
    }
}
