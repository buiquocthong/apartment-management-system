package vn.apartment.core.mvc.security.domain;

import java.util.HashSet;
import java.util.Set;

public class Permission {

    private String id;
    private Set<String> privileges = new HashSet<>();

    public Permission() {
        super();
    }

    public Permission(String id, Set<String> privileges) {
        setId(id);
        setPrivileges(privileges);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Set<String> getPrivileges() {
        return privileges;
    }

    public void setPrivileges(Set<String> privileges) {
        this.privileges = privileges;
    }
}
