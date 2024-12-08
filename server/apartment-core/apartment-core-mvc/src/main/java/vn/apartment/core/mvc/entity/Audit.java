package vn.apartment.core.mvc.entity;

import javax.persistence.Column;
import javax.persistence.Convert;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

import org.hibernate.envers.RevisionEntity;
import org.hibernate.envers.RevisionNumber;
import org.hibernate.envers.RevisionTimestamp;
import vn.apartment.core.model.audit.Editor;
import vn.apartment.core.mvc.converter.EditorJsonConverter;
import vn.apartment.core.mvc.revision.AuditListener;


@Entity
@RevisionEntity(AuditListener.class)
@Table(name = "AUDIT")
public class Audit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @RevisionNumber
    @Column(name = "ID")
    private Long id;

    @RevisionTimestamp
    @Column(name = "TIMESTAMP")
    private Date timestamp;

    @Column(name = "ACTION")
    private String action;

    @Column(name = "EDITOR", columnDefinition = "json")
    @Convert(converter = EditorJsonConverter.class)
    private Editor editor;

    @Column(name = "COMMENTS")
    private String comments;
    public Audit() {
        super();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public Editor getEditor() {
        return editor;
    }

    public void setEditor(Editor editor) {
        this.editor = editor;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
