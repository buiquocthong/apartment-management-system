package vn.apartment.master.dto.resident;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "Resident Info")
public class ResidentInfo {
    private String name;
    private String email;

    public ResidentInfo() {
        super();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
