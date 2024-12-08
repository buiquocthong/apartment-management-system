package vn.apartment.master.dao.spec;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.commom.FieldSortable;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.entity.record.Record;
import vn.apartment.master.entity.resident.Owner;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.List;
import java.util.Map;

public class RecordQuerySpec {
    private static final String RECORD_END_TIME = "endDate";
    private static final String RECORD_START_TIME = "startDate";
    private static final String RECORD_OWNER = "owner";

    private static final String OWNER_FIRST = "firstName";
    private static final String OWNER_LAST = "lastName";
    private static final String OWNER_MIDDLE = "middleName";

    private static final String DATE_FORMAT = "'%d-%m-%Y'";

    private static final Map<String, String> SORTED_FIELDS = Maps.newHashMap();
    static {
        SORTED_FIELDS.put("start_date", RECORD_START_TIME);
        SORTED_FIELDS.put("end_date", RECORD_END_TIME);
    }

    public static FieldSortable supportedFields() {
        return () -> SORTED_FIELDS;
    }

    public static Specification<Record> newSpecification(ApiQuery apiQuery) {
        return (root, query, cb) -> {
            List<Predicate> predicates = Lists.newArrayList();
            predicates.add(cb.equal(root.get("isDeleted"), false));
            String rawQuery = apiQuery.getQuery();

            if (ObjectUtils.isEmpty(rawQuery)) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            Join<Record, Owner> owner = root.join(RECORD_OWNER, JoinType.INNER);

            String keyword = PageableUtils.like(rawQuery);
            List<Predicate> queries = Lists.newArrayList();

            Expression<String> startExp = cb.function("date_format",
                    String.class, root.get(RECORD_START_TIME), cb.literal(DATE_FORMAT));
            queries.add(cb.like(cb.lower(startExp), keyword));

            Expression<String> endExp = cb.function("date_format",
                    String.class, root.get(RECORD_END_TIME), cb.literal(DATE_FORMAT));
            queries.add(cb.like(cb.lower(startExp), keyword));

            queries.add(cb.like(owner.get(OWNER_FIRST), keyword));
            queries.add(cb.like(owner.get(OWNER_MIDDLE), keyword));
            queries.add(cb.like(owner.get(OWNER_LAST), keyword));

            Predicate pQuery = cb.or(queries.toArray(new Predicate[0]));
            predicates.add(pQuery);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
    public static Specification<Record> softSpecification(ApiQuery apiQuery) {
        return (root, query, cb) -> {
            List<Predicate> predicates = Lists.newArrayList();
            predicates.add(cb.equal(root.get("isDeleted"), true));
            String rawQuery = apiQuery.getQuery();

            if (ObjectUtils.isEmpty(rawQuery)) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            Join<Record, Owner> owner = root.join(RECORD_OWNER, JoinType.INNER);

            String keyword = PageableUtils.like(rawQuery);
            List<Predicate> queries = Lists.newArrayList();

            Expression<String> startExp = cb.function("date_format",
                    String.class, root.get(RECORD_START_TIME), cb.literal(DATE_FORMAT));
            queries.add(cb.like(cb.lower(startExp), keyword));

            Expression<String> endExp = cb.function("date_format",
                    String.class, root.get(RECORD_END_TIME), cb.literal(DATE_FORMAT));
            queries.add(cb.like(cb.lower(startExp), keyword));

            queries.add(cb.like(owner.get(OWNER_FIRST), keyword));
            queries.add(cb.like(owner.get(OWNER_MIDDLE), keyword));
            queries.add(cb.like(owner.get(OWNER_LAST), keyword));

            Predicate pQuery = cb.or(queries.toArray(new Predicate[0]));
            predicates.add(pQuery);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
