package vn.apartment.core.mvc.aop;

import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.ObjectUtils;
import vn.apartment.core.model.anotation.AuditAction;
import vn.apartment.core.model.audit.AuditHolder;
import vn.apartment.core.model.audit.AuditRevision;


@Aspect
@Configuration
public class AuditActionExecutor {

    @Before(value = "execution(* *(..)) && @annotation(action)", argNames = "action")
    public void setAuditTrailAction(AuditAction action) {

        AuditRevision revision = AuditHolder.getCurrentRevision();

        if (ObjectUtils.isEmpty(revision.getAction())) {
            revision.setAction(action.value());
        }
    }
}
