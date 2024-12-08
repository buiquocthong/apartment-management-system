package vn.apartment.core.mvc.security.domain;

public class AccountInfo {

    private String first;

    private String last;

    private String middle;

    private String prefix;

    private String country;

    public AccountInfo() {
        super();
    }

    public String getFirst() {
        return first;
    }

    public void setFirst(String first) {
        this.first = first;
    }

    public AccountInfo firstName(String firstName) {
        setFirst(firstName);
        return this;
    }

    public String getLast() {
        return last;
    }

    public void setLast(String last) {
        this.last = last;
    }

    public AccountInfo lastName(String lastName) {
        setLast(lastName);
        return this;
    }

    public String getMiddle() {
        return middle;
    }

    public void setMiddle(String middle) {
        this.middle = middle;
    }

    public AccountInfo middleName(String middleName) {
        setMiddle(middleName);
        return this;
    }

    public String getPrefix() {
        return prefix;
    }

    public void setPrefix(String prefix) {
        this.prefix = prefix;
    }

    public AccountInfo prefixName(String prefixName) {
        setPrefix(prefixName);
        return this;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }
    public AccountInfo countryCode(String countryCode) {
        setCountry(countryCode);
        return this;
    }
}
