package vn.apartment.master.dao.spec;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.commom.FieldSortable;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dto.contract.ContractStatus;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Contract;
import vn.apartment.master.entity.resident.Owner;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ContractQuerySpec {

    private static final String CONTRACT_STATUS = "status";
    private static final String CONTRACT_START_TIME = "startDate";
    private static final String CONTRACT_APARTMENT = "apartment";
    private static final String CONTRACT_OWNER = "owner";

    private static final String APARTMENT_NAME = "name";
    private static final String OWNER_FIRST = "firstName";
    private static final String OWNER_LAST = "lastName";
    private static final String OWNER_MIDDLE = "middleName";

    private static final String DATE_FORMAT = "'%d-%m-%Y'";

    private static final Map<String, String> SORTED_FIELDS = Maps.newHashMap();
    static {
        SORTED_FIELDS.put("status", CONTRACT_STATUS);
        SORTED_FIELDS.put("start_date", CONTRACT_START_TIME);
    }

    public static FieldSortable supportedFields() {
        return () -> SORTED_FIELDS;
    }

    public static Specification<Contract> newSpecification(ApiQuery apiQuery) {
        return (root, query, cb) -> {

            List<Predicate> predicates = Lists.newArrayList();
            predicates.add(cb.equal(root.get("isDeleted"), false));
            String rawQuery = apiQuery.getQuery();

            if (ObjectUtils.isEmpty(rawQuery)) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            Join<Contract, Apartment> apartment = root.join(CONTRACT_APARTMENT, JoinType.INNER);
            Join<Contract, Owner> owner = root.join(CONTRACT_OWNER, JoinType.INNER);

            String keyword = PageableUtils.like(rawQuery);
            List<Predicate> queries = Lists.newArrayList();

            Expression<String> startExp = cb.function("date_format",
                    String.class, root.get(CONTRACT_START_TIME), cb.literal(DATE_FORMAT));
            queries.add(cb.like(cb.lower(startExp), keyword));

            Set<ContractStatus> statuses = getStatuses(rawQuery);
            if (ObjectUtils.isNotEmpty(statuses)) {
                queries.add(root.get(CONTRACT_STATUS).in(statuses));
            }

            queries.add(cb.like(apartment.get(APARTMENT_NAME), keyword));
            queries.add(cb.like(owner.get(OWNER_FIRST), keyword));
            queries.add(cb.like(owner.get(OWNER_LAST), keyword));
            queries.add(cb.like(owner.get(OWNER_MIDDLE), keyword));

            Predicate pQuery = cb.or(queries.toArray(new Predicate[0]));
            predicates.add(pQuery);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Set<ContractStatus> getStatuses(final String keyword) {
        return Arrays.stream(ContractStatus.values())
                .filter((status -> status.toString().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toSet());
    }
}
