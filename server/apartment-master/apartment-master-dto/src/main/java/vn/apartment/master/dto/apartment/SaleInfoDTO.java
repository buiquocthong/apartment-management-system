package vn.apartment.master.dto.apartment;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.Date;

@Schema(name = "Sale Info")
public class SaleInfoDTO {

    @JsonProperty(value = "purchase_price")
    private BigDecimal purchasePrice;

    @JsonProperty(value = "sale_date")
    private Date saleDate;

    public SaleInfoDTO() {
    }

    public SaleInfoDTO(BigDecimal purchasePrice, Date saleDate) {
        this.purchasePrice = purchasePrice;
        this.saleDate = saleDate;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Date getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(Date saleDate) {
        this.saleDate = saleDate;
    }
}
