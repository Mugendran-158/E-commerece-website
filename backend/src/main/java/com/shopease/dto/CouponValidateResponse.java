package com.shopease.dto;

import java.math.BigDecimal;

/** Returned when a coupon code is validated at checkout. */
public class CouponValidateResponse {

    private boolean valid;
    private String message;
    private String code;
    private String discountType;
    private BigDecimal discountValue;
    private BigDecimal discountAmount;   // actual money saved
    private BigDecimal finalAmount;       // cart total after discount

    public CouponValidateResponse() {}

    public static CouponValidateResponse invalid(String message) {
        CouponValidateResponse r = new CouponValidateResponse();
        r.valid = false;
        r.message = message;
        return r;
    }

    public static CouponValidateResponse valid(
            String code, String discountType, BigDecimal discountValue,
            BigDecimal discountAmount, BigDecimal finalAmount) {
        CouponValidateResponse r = new CouponValidateResponse();
        r.valid = true;
        r.code = code;
        r.discountType = discountType;
        r.discountValue = discountValue;
        r.discountAmount = discountAmount;
        r.finalAmount = finalAmount;
        return r;
    }

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDiscountType() { return discountType; }
    public void setDiscountType(String discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }
}
