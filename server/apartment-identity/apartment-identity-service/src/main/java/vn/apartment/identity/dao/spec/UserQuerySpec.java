package vn.apartment.identity.dao.spec;

import javax.persistence.criteria.Expression;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.lang3.ObjectUtils;

import org.springframework.data.jpa.domain.Specification;
import vn.apartment.core.model.api.ApiQuery;
import vn.apartment.core.model.commom.FieldSortable;
import vn.apartment.core.mvc.data.PageableUtils;
import vn.apartment.identity.dto.enums.UserStatus;
import vn.apartment.identity.entity.Auth;
import vn.apartment.identity.entity.User;
import vn.apartment.identity.entity.UserInfo;

public final class UserQuerySpec {

    private static final String USER_USERINFO = "userInfo";
    private static final String USER_AUTH = "auth";
    private static final String USER_ROLE = "role";
    private static final String USER_USERID = "userId";
    private static final String USER_UPDATED_AT = "updatedAt";

    private static final String USER_STATUS = "status";
    private static final String AUTH_USERNAME = "username";
    private static final String ROLE_LABEL = "label";

    private static final String USERINFO_MAIL = "email";
    private static final String USERINFO_FIRST = "first";
    private static final String USERINFO_LAST = "last";
    private static final String USERINFO_PHONE = "phone";

    private static final Map<String, String> SORTED_FIELDS = Maps.newHashMap();
    static {
        SORTED_FIELDS.put("updated_at", USER_UPDATED_AT);
        SORTED_FIELDS.put("status", USER_STATUS);
        SORTED_FIELDS.put("username", "auth.username");
        SORTED_FIELDS.put("role", "role.label");
        SORTED_FIELDS.put("email", "userInfo.email");
    }

    public static FieldSortable supportedFields() {
        return () -> SORTED_FIELDS;
    }

    public static Specification<User> newSpecification(ApiQuery apiQuery) {

        return (root, query, cb) -> {

            List<Predicate> predicates = Lists.newArrayList();
            String rawQuery = apiQuery.getQuery();

            if (ObjectUtils.isEmpty(rawQuery)) {
                return cb.and(predicates.toArray(new Predicate[0]));
            }

            Join<User, UserInfo> userInfo = root.join(USER_USERINFO, JoinType.INNER);
            Join<User, Auth> role = root.join(USER_ROLE, JoinType.INNER);
            Join<User, Auth> auth = root.join(USER_AUTH, JoinType.INNER);

            String keyword = PageableUtils.like(rawQuery);
            List<Predicate> queries = Lists.newArrayList();

            queries.add(cb.equal(root.get(USER_USERID), rawQuery));
            Set<UserStatus> statuses = getStatuses(rawQuery);
            if (ObjectUtils.isNotEmpty(statuses)) {
                queries.add(root.get(USER_STATUS).in(statuses));
            }
            Expression<String> dateStringExpr = cb.function("date_format",
                String.class, root.get(USER_UPDATED_AT), cb.literal("'%d/%m/%Y %H:%i:%s'"));
            queries.add(cb.like(cb.lower(dateStringExpr), keyword));

            queries.add(cb.like(auth.get(AUTH_USERNAME), keyword));

            queries.add(cb.like(role.get(ROLE_LABEL), keyword));

            queries.add(cb.like(userInfo.get(USERINFO_MAIL), keyword));
            queries.add(cb.like(userInfo.get(USERINFO_FIRST), keyword));
            queries.add(cb.like(userInfo.get(USERINFO_LAST), keyword));
            queries.add(cb.like(userInfo.get(USERINFO_PHONE), keyword));

            Predicate pQuery = cb.or(queries.toArray(new Predicate[predicates.size()]));
            predicates.add(pQuery);

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    private static Set<UserStatus> getStatuses(final String keyword) {
        return Arrays.stream(UserStatus.values())
            .filter((status -> status.toString().toLowerCase().contains(keyword.toLowerCase())))
            .collect(Collectors.toSet());
    }

}
