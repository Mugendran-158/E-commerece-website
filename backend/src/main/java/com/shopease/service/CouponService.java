package com.shopease.service;

import com.shopease.dto.CouponDto;
import com.shopease.dto.CouponRequest;
import com.shopease.dto.CouponValidateResponse;
import com.shopease.entity.Coupon;
import com.shopease.entity.Coupon.DiscountType;
import com.shopease.repository.CouponRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    // ─── Public: validate coupon at checkout ─────────────────────────────────

    public CouponValidateResponse validate(String code, BigDecimal cartTotal) {
        Coupon coupon = couponRepository.findByCodeIgnoreCase(code)
                .orElse(null);

        if (coupon == null) {
            return CouponValidateResponse.invalid("Coupon code not found.");
        }
        if (!coupon.isActive()) {
            return CouponValidateResponse.invalid("This coupon is no longer active.");
        }
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom())) {
            return CouponValidateResponse.invalid("This coupon is not yet valid.");
        }
        if (now.isAfter(coupon.getValidUntil())) {
            return CouponValidateResponse.invalid("This coupon has expired.");
        }
        if (coupon.getMaxUses() != null && coupon.getUsedCount() >= coupon.getMaxUses()) {
            return CouponValidateResponse.invalid("This coupon has reached its usage limit.");
        }
        if (coupon.getMinOrderAmount() != null && cartTotal.compareTo(coupon.getMinOrderAmount()) < 0) {
            return CouponValidateResponse.invalid(
                    "Minimum order of ₹" + coupon.getMinOrderAmount().setScale(0, RoundingMode.HALF_UP) + " required.");
        }

        BigDecimal discountAmount;
        if (coupon.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = cartTotal
                    .multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountAmount() != null
                    && discountAmount.compareTo(coupon.getMaxDiscountAmount()) > 0) {
                discountAmount = coupon.getMaxDiscountAmount();
            }
        } else {
            discountAmount = coupon.getDiscountValue().min(cartTotal);
        }

        BigDecimal finalAmount = cartTotal.subtract(discountAmount).max(BigDecimal.ZERO);

        return CouponValidateResponse.valid(
                coupon.getCode().toUpperCase(),
                coupon.getDiscountType().name(),
                coupon.getDiscountValue(),
                discountAmount,
                finalAmount
        );
    }

    /** Increment usage count after successful order placement. */
    @Transactional
    public void incrementUsage(String code) {
        couponRepository.findByCodeIgnoreCase(code).ifPresent(c -> {
            c.setUsedCount(c.getUsedCount() + 1);
            couponRepository.save(c);
        });
    }

    // ─── Admin CRUD ───────────────────────────────────────────────────────────

    public List<CouponDto> getAllCoupons() {
        return couponRepository.findAll()
                .stream()
                .map(CouponDto::fromEntity)
                .collect(Collectors.toList());
    }

    public CouponDto getCouponById(Long id) {
        return CouponDto.fromEntity(couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found")));
    }

    @Transactional
    public CouponDto createCoupon(CouponRequest req) {
        if (couponRepository.existsByCodeIgnoreCase(req.getCode())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Coupon code already exists.");
        }
        Coupon coupon = buildFromRequest(new Coupon(), req);
        return CouponDto.fromEntity(couponRepository.save(coupon));
    }

    @Transactional
    public CouponDto updateCoupon(Long id, CouponRequest req) {
        Coupon coupon = couponRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found"));
        buildFromRequest(coupon, req);
        return CouponDto.fromEntity(couponRepository.save(coupon));
    }

    @Transactional
    public void deleteCoupon(Long id) {
        if (!couponRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Coupon not found");
        }
        couponRepository.deleteById(id);
    }

    private Coupon buildFromRequest(Coupon coupon, CouponRequest req) {
        coupon.setCode(req.getCode().toUpperCase().trim());
        coupon.setDescription(req.getDescription());
        coupon.setDiscountType(req.getDiscountType());
        coupon.setDiscountValue(req.getDiscountValue());
        coupon.setMinOrderAmount(req.getMinOrderAmount());
        coupon.setMaxDiscountAmount(req.getMaxDiscountAmount());
        coupon.setValidFrom(req.getValidFrom());
        coupon.setValidUntil(req.getValidUntil());
        coupon.setMaxUses(req.getMaxUses());
        coupon.setActive(req.isActive());
        return coupon;
    }
}
