package vn.apartment.core.model.api;

import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "API Query")
public class ApiQuery {
    public enum Direction {
        DESC,
        ASC
    }
    @JsonProperty(value = "limit", defaultValue = "50")
    @Size(min = 1, max = 1000)
    private int limit = 50;

    @JsonProperty(value = "offset", defaultValue = "0")
    @Min(0)
    private int offset = 0;

    @JsonProperty(value = "sort_by")
    private String sortBy;

    @JsonProperty(value = "direction", defaultValue = "asc")
    private Direction direction = Direction.ASC;

    @JsonProperty(value = "query")
    private String query;

    public ApiQuery() {
        super();
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public String getSortBy() {
        return sortBy;
    }

    public void setSort_by(String sortBy) {
        setSortBy(sortBy);
    }

    public void setSortBy(String sortBy) {
        this.sortBy = sortBy;
    }

    public Direction getDirection() {
        return direction;
    }

    public void setDirection(Direction direction) {
        this.direction = direction;
    }

    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

}
