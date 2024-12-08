package vn.apartment.core.mongdb.aggregate;

import java.util.List;
import com.google.common.collect.Lists;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.AggregationOperation;
import org.springframework.data.mongodb.core.query.Criteria;
import static org.springframework.data.mongodb.core.aggregation.TypedAggregation.newAggregation;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.count;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.match;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.sort;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.skip;
import static org.springframework.data.mongodb.core.aggregation.Aggregation.limit;

public class AggregationRepository {

    private final MongoTemplate mongoTemplate;

    public AggregationRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public <T> Page<T> findAll(Criteria criteria, Pageable pageable, Class<T> clazz) {

        CountResult countResult = mongoTemplate.aggregate(
            newAggregation(clazz, match(criteria), count().as(CountResult.TOTAL_COUNT)),
            CountResult.class)
            .getUniqueMappedResult();

        if (countResult != null && countResult.getTotalCount() > 0) {

            List<AggregationOperation> operations = Lists.newArrayList(match(criteria));
            if (pageable.getSort().isSorted()) {
                operations.add(sort(pageable.getSort()));
            }
            operations.add(skip(pageable.getOffset()));
            operations.add(limit(pageable.getPageSize()));

            List<T> mails = mongoTemplate.aggregate(newAggregation(clazz, operations), clazz)
                .getMappedResults();

            return new PageImpl(mails, pageable, countResult.getTotalCount());
        }

        return new PageImpl(Lists.newArrayList(), pageable, 0L);
    }

}
