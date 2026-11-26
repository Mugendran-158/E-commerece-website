package com.shopease.dto;

import com.shopease.entity.Coupon;
import com.shopease.entity.Coupon.DiscountType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CouponDto {

    private Long id;
    private String code;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private Integer maxUses;
    private int usedCount;
    private boolean active;

    public CouponDto() {}

    public static CouponDto fromEntity(Coupon c) {
        CouponDto dto = new CouponDto();
        dto.id = c.getId();
        dto.code = c.getCode();
        dto.description = c.getDescription();
        dto.discountType = c.getDiscountType();
        dto.discountValue = c.getDiscountValue();
        dto.minOrderAmount = c.getMinOrderAmount();
        dto.maxDiscountAmount = c.getMaxDiscountAmount();
        dto.validFrom = c.getValidFrom();
        dto.validUntil = c.getValidUntil();
        dto.maxUses = c.getMaxUses();
        dto.usedCount = c.getUsedCount();
        dto.active = c.isActive();
        return dto;
    }

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public BigDecimal getDiscountValue() { return discountValue; }
    public void setDiscountValue(BigDecimal discountValue) { this.discountValue = discountValue; }

    public BigDecimal getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(BigDecimal minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public BigDecimal getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(BigDecimal maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }

    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public Integer getMaxUses() { return maxUses; }
    public void setMaxUses(Integer maxUses) { this.maxUses = maxUses; }

    public int getUsedCount() { return usedCount; }
    public void setUsedCount(int usedCount) { this.usedCount = usedCount; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
