package vn.apartment.notification.dto.mail;


public enum Priority {
    HIGHEST(1),
    NORMAL(3),
    LOWEST(5);

    private final int priority;
    Priority(int priority) {
        this.priority = priority;
    }

    public int getPriority() {
        return priority;
    }
}
