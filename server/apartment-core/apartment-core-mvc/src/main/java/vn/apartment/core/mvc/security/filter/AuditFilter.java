package vn.apartment.core.mvc.security.filter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;
import vn.apartment.core.model.audit.AuditHolder;
import vn.apartment.core.model.audit.AuditRevision;
import vn.apartment.core.model.audit.Editor;
import vn.apartment.core.mvc.security.domain.Account;
import vn.apartment.core.mvc.security.holder.AuthHolder;


public class AuditFilter extends OncePerRequestFilter {

    private final AuthHolder authHolder;

    public AuditFilter(AuthHolder authHolder) {
        this.authHolder = authHolder;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response, FilterChain filterChain)
        throws ServletException, IOException {

        AuditRevision revision = new AuditRevision();
        setEditorIfAny(revision);
        AuditHolder.instance().setCurrentRevision(revision);
        filterChain.doFilter(request, response);
    }

    private void setEditorIfAny(AuditRevision revision) {
        if (!authHolder.isAuthenticated()) {
            return;
        }
        Editor editor = new Editor();
        Account account = authHolder.getPrincipal();
        editor.setId(account.getId());
        editor.setEmail(account.getEmail());
        editor.setName(account.getName());
        revision.setEditor(editor);
    }

}
