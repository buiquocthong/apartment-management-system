package vn.apartment.core.mvc.data;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.commom.FieldSortable;
import vn.apartment.core.model.exception.InvalidParameterException;
import java.util.Map;
import static org.springframework.util.ObjectUtils.isEmpty;


public class PageableUtils {


    public static Pageable of(ApiQuery query) {

        return PageRequest.of(query.getOffset(), query.getLimit(),
            ordered(query.getDirection(), query.getSortBy()));
    }

    public static Pageable of(ApiQuery query, FieldSortable sortable) {

        final String rawSortBy = query.getSortBy();

        if (isEmpty(rawSortBy)) {
            return PageRequest.of(query.getOffset(), query.getLimit());
        }

        if (sortable != null && !isEmpty(sortable.getFields())) {

            Map<String, String> cols = sortable.getFields();
            final String sortableCol = cols.get(rawSortBy);

            if (sortableCol != null) {

                return PageRequest.of(query.getOffset(), query.getLimit(),
                    ordered(query.getDirection(), sortableCol));
            }

            throw new InvalidParameterException("The " + rawSortBy + " field is not support sort.");
        }

        return PageRequest.of(query.getOffset(), query.getLimit(),
            ordered(query.getDirection(), rawSortBy));
    }

    public static Sort ordered(ApiQuery.Direction direction, String sortBy) {

        return direction == null
            ? Sort.by(Sort.Direction.ASC, sortBy)
            : Sort.by(Sort.Direction.fromString(direction.name()), sortBy);
    }

    public static String like(String keyword) {
        return "%" + keyword.trim() + "%";
    }
}
