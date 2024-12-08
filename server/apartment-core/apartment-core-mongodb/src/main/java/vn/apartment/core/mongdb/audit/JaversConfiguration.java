package vn.apartment.core.mongdb.audit;

import java.util.Map;

import com.google.common.collect.Maps;
import org.javers.spring.auditable.AuthorProvider;
import org.javers.spring.auditable.CommitPropertiesProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import vn.apartment.apartment.core.utils.Dates;
import vn.apartment.core.model.audit.AuditHolder;
import vn.apartment.core.model.audit.AuditRevision;


@Configuration
public class JaversConfiguration {

    @Bean
    public AuthorProvider provideJaversAuthor() {
        return () -> getAuditRevision().getEditor().getId();
    }

    @Bean
    public CommitPropertiesProvider commitPropertiesProvider() {
        return new CommitPropertiesProvider() {
            @Override
            public Map<String, String> provideForCommittedObject(Object domainObject) {
                AuditRevision revision = getAuditRevision();
                Map<String, String> metadata = Maps.newHashMap();
                metadata.put("email", revision.getEditor().getEmail());
                metadata.put("name", revision.getEditor().getName());
                metadata.put("action", revision.getAction());
                metadata.put("comments", revision.getComments());
                metadata.put("timestamp", Dates.now().toString());

                return metadata;
            }
        };
    }

    private static AuditRevision getAuditRevision() {
        return AuditHolder.getCurrentRevision();
    }
}
