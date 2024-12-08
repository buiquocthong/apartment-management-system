package vn.apartment.master.dao.spec;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.commom.FieldSortable;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.entity.resident.Household;
import vn.apartment.master.entity.resident.Owner;

import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.List;
import java.util.Map;

public class HouseholdQuerySpec {

    private static final String HOUSEHOLD_OWNER = "owners";
    private static final String OWNER_FIRST_NAME = "firstName";
    private static final String OWNER_LAST_NAME = "lastName";
    private static final String OWNER_MIDDLE_NAME = "middleName";
    private static final String OWNER_EMAIL = "email";
    private static final String OWNER_PHONE = "phoneNumber";

    private static final Map<String, String> SORTED_FIELDS = Maps.newHashMap();
    static {

    }

    public static FieldSortable supportedFields() {
        return () -> SORTED_FIELDS;
    }

    public static Specification<Household> newSpecification(ApiQuery apiQuery) {
        return (root, query, cb) -> {

            List<Predicate> predicates = Lists.newArrayList();
            predicates.add(cb.equal(root.get("isDeleted"), false));
            String rawQuery = apiQuery.getQuery();

            if (ObjectUtils.isEmpty(rawQuery)) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            Join<Household, Owner> owner = root.join(HOUSEHOLD_OWNER, JoinType.INNER);

            String keyword = PageableUtils.like(rawQuery);
            List<Predicate> queries = Lists.newArrayList();

            queries.add(cb.like(owner.get(OWNER_FIRST_NAME), keyword));
            queries.add(cb.like(owner.get(OWNER_LAST_NAME), keyword));
            queries.add(cb.like(owner.get(OWNER_PHONE), keyword));
            queries.add(cb.like(owner.get(OWNER_MIDDLE_NAME), keyword));
            queries.add(cb.like(owner.get(OWNER_EMAIL), keyword));

            Predicate pQuery = cb.or(queries.toArray(new Predicate[0]));
            predicates.add(pQuery);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
