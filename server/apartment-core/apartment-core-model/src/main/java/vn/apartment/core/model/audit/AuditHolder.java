package vn.apartment.core.model.audit;

public final class AuditHolder {

    private static final AuditHolder HOLDER = new AuditHolder();

    private static ThreadLocal<AuditRevision> threadLocal = new ThreadLocal<>();

    public static void setCurrentRevision(AuditRevision auditRevisionInfo) {
        threadLocal.set(auditRevisionInfo);
    }

    public static AuditRevision getCurrentRevision() {
        return threadLocal.get();
    }

    public static AuditHolder instance() {
        return HOLDER;
    }
}
