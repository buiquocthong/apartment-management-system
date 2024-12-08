package vn.apartment.core.model.audit;

import java.io.Serializable;
import java.util.Objects;


public class Editor implements Serializable {

    private String id;
    private String email;
    private String name;

    public Editor() {
        super();
    }

    public Editor(String id, String email, String name) {
        setId(id);
        setEmail(email);
        setName(name);
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Editor editor = (Editor) o;
        return Objects.equals(id, editor.id)
            && Objects.equals(email, editor.email)
            && Objects.equals(name, editor.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email, name);
    }
}
