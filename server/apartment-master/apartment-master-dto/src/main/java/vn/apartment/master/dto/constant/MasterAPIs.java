package vn.apartment.master.dto.constant;

public class MasterAPIs {

    public static final String API = "/api";

    public static final String APARTMENT_API = API + "/apartments";

    public static final String BLOCK_API = API + "/blocks";

    public static final String CONTRACT_API = API + "/contracts";

    public static final String OWNER_API = API + "/owners";

    public static final String RENTER_API = API + "/renters";

    public static final String SERVICE_API = API + "/services";

    public static final String SERVICE_DETAIL_API = API + "/service_details";

    public static final String INVOICE_API = API + "/invoices";

    public static final String FLOOR_API = API + "/floors";

    public static final String HOUSEHOLD_API = API + "/households";

    public static final String RECORD_API = API + "/records";

    public static final String INVOICE_SETTING_API = API + "/invoice_setting";

    public static final String PAID_INVOICE_API = INVOICE_API + "/approved/{invoiceId}";
}
