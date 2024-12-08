package vn.apartment.core.model.audit;

public class AuditRevision {

    private Editor editor;
    private String action;
    private String comments;

    public AuditRevision() {
        super();
    }

    public Editor getEditor() {
        return editor;
    }

    public void setEditor(Editor editor) {
        this.editor = editor;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }

}
