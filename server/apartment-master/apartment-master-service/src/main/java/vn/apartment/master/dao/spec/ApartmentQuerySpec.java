package vn.apartment.master.dao.spec;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.commom.FieldSortable;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dto.apartment.ApartmentStatus;
import vn.apartment.master.entity.apartment.Apartment;

import javax.persistence.criteria.Predicate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class ApartmentQuerySpec {

    private static final String APARTMENT_STATUS = "status";
    private static final String APARTMENT_NAME = "name";


    private static final Map<String, String> SORTED_FIELDS = Maps.newHashMap();
    static {
        SORTED_FIELDS.put("status", APARTMENT_STATUS);
        SORTED_FIELDS.put("name", APARTMENT_NAME);
    }

    public static FieldSortable supportedFields() {
        return () -> SORTED_FIELDS;
    }

    public static Specification<Apartment> newSpecification(ApiQuery apiQuery) {
        return (root, query, cb) -> {

            List<Predicate> predicates = Lists.newArrayList();
            String rawQuery = apiQuery.getQuery();
            if (ObjectUtils.isEmpty(rawQuery)) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }
            String keyword = PageableUtils.like(rawQuery);
            List<Predicate> queries = Lists.newArrayList();

            queries.add(cb.like(root.get(APARTMENT_NAME), rawQuery));

            Set<ApartmentStatus> statuses = getStatuses(rawQuery);
            if (ObjectUtils.isNotEmpty(statuses)) {
                queries.add(root.get(APARTMENT_STATUS).in(statuses));
            }

            Predicate pQuery = cb.or(queries.toArray(new Predicate[0]));
            predicates.add(pQuery);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Set<ApartmentStatus> getStatuses(final String keyword) {
        return Arrays.stream(ApartmentStatus.values())
                .filter((status -> status.toString().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toSet());
    }
}
