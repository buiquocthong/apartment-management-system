package vn.apartment.core.mongdb.aggregate;


public class CountResult {

    public static final String TOTAL_COUNT = "totalCount";

    private Long totalCount;

    public CountResult() {
        super();
    }

    public Long getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(Long totalCount) {
        this.totalCount = totalCount;
    }
}
