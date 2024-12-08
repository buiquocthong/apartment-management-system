package vn.apartment.core.model.api;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "API Page")
public class ApiPage<T> {

    @JsonProperty(value = "total_count")
    private final long total;

    @JsonProperty(value = "items")
    private final List<T> items;

    public ApiPage(long total, List<T> items) {
        this.total = total;
        this.items = items;
    }

    public long getTotal() {
        return total;
    }

    public List<T> getItems() {
        return items;
    }
}
