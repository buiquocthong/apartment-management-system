package vn.apartment.core.mvc.revision;

import org.hibernate.envers.RevisionListener;
import vn.apartment.core.model.audit.AuditHolder;
import vn.apartment.core.model.audit.AuditRevision;
import vn.apartment.core.mvc.entity.Audit;


public class AuditListener implements RevisionListener {

    @Override
    public void newRevision(Object entityRev) {
        Audit audit = (Audit) entityRev;
        AuditRevision revisionInfo = AuditHolder.instance().getCurrentRevision();
        if ( revisionInfo != null ) {
            audit.setEditor(revisionInfo.getEditor());
            audit.setAction(revisionInfo.getAction());
            audit.setComments(revisionInfo.getComments());
        }
    }
}
