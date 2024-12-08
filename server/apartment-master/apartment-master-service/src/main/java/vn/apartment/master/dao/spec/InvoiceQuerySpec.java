package vn.apartment.master.dao.spec;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.ObjectUtils;
import org.springframework.data.jpa.domain.Specification;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.commom.FieldSortable;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.master.dto.invoice.InvoiceStatus;
import vn.apartment.master.entity.apartment.Apartment;
import vn.apartment.master.entity.record.Invoice;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class InvoiceQuerySpec {

    private static final String INVOICE_STATUS = "status";
    private static final String INVOICE_APARTMENT = "apartment";
    private static final String INVOICE_PAYMENT_DEADLINE = "paymentDeadline";

    private static final String APARTMENT_NAME = "name";

    private static final String DATE_FORMAT = "'%d-%m-%Y'";

    private static final Map<String, String> SORTED_FIELDS = Maps.newHashMap();
    static {
        SORTED_FIELDS.put("status", INVOICE_STATUS);
        SORTED_FIELDS.put("payment_deadline", INVOICE_PAYMENT_DEADLINE);
    }

    public static FieldSortable supportedFields() {
        return () -> SORTED_FIELDS;
    }

    public static Specification<Invoice> newSpecification(ApiQuery apiQuery) {
        return (root, query, cb) -> {

            List<Predicate> predicates = Lists.newArrayList();
            predicates.add(cb.equal(root.get("isDeleted"), false));
            String rawQuery = apiQuery.getQuery();

            if (ObjectUtils.isEmpty(rawQuery)) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            Join<Invoice, Apartment> apartment = root.join(INVOICE_APARTMENT, JoinType.INNER);

            String keyword = PageableUtils.like(rawQuery);
            List<Predicate> queries = Lists.newArrayList();

            Set<InvoiceStatus> invoiceStatuses = getStatus(rawQuery);
            if (ObjectUtils.isNotEmpty(invoiceStatuses)) {
                queries.add(root.get(INVOICE_STATUS).in(invoiceStatuses));
            }

            Expression<String> paymentExp = cb.function("date_format",
                    String.class, root.get(INVOICE_PAYMENT_DEADLINE), cb.literal(DATE_FORMAT));
            queries.add(cb.like(cb.lower(paymentExp), keyword));

            queries.add(cb.like(apartment.get(APARTMENT_NAME), keyword));

            Predicate pQuery = cb.or(queries.toArray(new Predicate[0]));
            predicates.add(pQuery);
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Set<InvoiceStatus> getStatus(final String keyword) {
        return Arrays.stream(InvoiceStatus.values())
                .filter((status -> status.toString().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toSet());
    }
}
