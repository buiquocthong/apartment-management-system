package vn.apartment.core.mvc.entity;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;


@MappedSuperclass
public class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ID")
    private Long id;

    public BaseEntity() {
        super();
    }

    public Long getPk() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
