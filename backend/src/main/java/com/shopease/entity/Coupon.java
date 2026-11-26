package com.shopease.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
public class Coupon {

    public enum DiscountType {
        PERCENTAGE, FLAT, FIXED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String code;

    @Column(length = 255)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType;

    /** Percentage (0-100) or flat amount */
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;

    /** Minimum cart total required to apply this coupon */
    @Column(precision = 10, scale = 2)
    private BigDecimal minOrderAmount;

    /** Maximum discount cap (for PERCENTAGE type) */
    @Column(precision = 10, scale = 2)
    private BigDecimal maxDiscountAmount;

    @Column(nullable = false)
    private LocalDateTime validFrom;

    @Column(nullable = false)
    private LocalDateTime validUntil;

    /** How many times this coupon can be used in total (null = unlimited) */
    private Integer maxUses;

    @Column(nullable = false)
    private int usedCount = 0;

    @Column(nullable = false)
    private boolean active = true;

    public Coupon() {}

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

    // Aliases to match alternate specifications
    public BigDecimal getMinimumOrderAmount() { return minOrderAmount; }
    public void setMinimumOrderAmount(BigDecimal minimumOrderAmount) { this.minOrderAmount = minimumOrderAmount; }

    public BigDecimal getMaximumDiscount() { return maxDiscountAmount; }
    public void setMaximumDiscount(BigDecimal maximumDiscount) { this.maxDiscountAmount = maximumDiscount; }

    public LocalDateTime getExpiryDate() { return validUntil; }
    public void setExpiryDate(LocalDateTime expiryDate) { this.validUntil = expiryDate; }

    public Integer getUsageLimit() { return maxUses; }
    public void setUsageLimit(Integer usageLimit) { this.maxUses = usageLimit; }
}
