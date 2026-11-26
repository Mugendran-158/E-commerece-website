package com.shopease.controller;

import com.shopease.dto.CouponDto;
import com.shopease.dto.CouponRequest;
import com.shopease.dto.CouponValidateResponse;
import com.shopease.service.CouponService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    /**
     * Public endpoint — validate a coupon code at checkout.
     * GET /api/coupons/validate?code=SAVE10&cartTotal=500
     */
    @GetMapping("/coupons/validate")
    public ResponseEntity<CouponValidateResponse> validateCoupon(
            @RequestParam String code,
            @RequestParam BigDecimal cartTotal) {
        return ResponseEntity.ok(couponService.validate(code, cartTotal));
    }

    /**
     * User endpoint — apply coupon code at checkout.
     * POST /api/coupons/apply
     * Body: { "code": "SAVE10", "cartTotal": 500 }
     */
    @PostMapping("/coupons/apply")
    public ResponseEntity<?> applyCoupon(@RequestBody Map<String, Object> body) {
        if (body == null || !body.containsKey("code") || body.get("code") == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Coupon code is required", "valid", false));
        }
        String code = body.get("code").toString().trim();
        BigDecimal cartTotal = BigDecimal.ZERO;
        if (body.containsKey("cartTotal") && body.get("cartTotal") != null) {
            try {
                cartTotal = new BigDecimal(body.get("cartTotal").toString());
            } catch (Exception ignored) {}
        }
        CouponValidateResponse response = couponService.validate(code, cartTotal);
        if (!response.isValid()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    // ─── Admin Endpoints ───────────────────────────────────────────────────────

    @GetMapping("/admin/coupons")
    public ResponseEntity<List<CouponDto>> getAllCoupons() {
        return ResponseEntity.ok(couponService.getAllCoupons());
    }

    @GetMapping("/admin/coupons/{id}")
    public ResponseEntity<CouponDto> getCoupon(@PathVariable Long id) {
        return ResponseEntity.ok(couponService.getCouponById(id));
    }

    @PostMapping("/admin/coupons")
    public ResponseEntity<CouponDto> createCoupon(@RequestBody CouponRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(couponService.createCoupon(req));
    }

    @PutMapping("/admin/coupons/{id}")
    public ResponseEntity<CouponDto> updateCoupon(@PathVariable Long id, @RequestBody CouponRequest req) {
        return ResponseEntity.ok(couponService.updateCoupon(id, req));
    }

    @DeleteMapping("/admin/coupons/{id}")
    public ResponseEntity<Map<String, String>> deleteCoupon(@PathVariable Long id) {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok(Map.of("message", "Coupon deleted."));
    }
}
