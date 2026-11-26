package com.shopease.controller;

import com.shopease.dto.ReviewDto;
import com.shopease.dto.ReviewRequest;
import com.shopease.service.ReviewService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * ReviewController — REST endpoints for customer review operations.
 *
 * Public:
 *   GET  /api/products/{productId}/reviews        → List reviews for a product
 *
 * Authenticated USER:
 *   POST /api/products/{productId}/reviews        → Create review (must have purchased)
 *   PUT  /api/reviews/{reviewId}                  → Edit own review
 *   DELETE /api/reviews/{reviewId}               → Delete own review
 *   GET  /api/products/{productId}/reviews/status → Check if user reviewed / purchased
 */
@RestController
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // ────────────────────────────────────────────────────────
    // GET reviews for a product (public)
    // ────────────────────────────────────────────────────────
    @GetMapping("/api/products/{productId}/reviews")
    public ResponseEntity<List<ReviewDto>> getReviewsByProduct(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // ────────────────────────────────────────────────────────
    // GET review status for current user on a product (auth required)
    // ────────────────────────────────────────────────────────
    @GetMapping("/api/products/{productId}/reviews/status")
    public ResponseEntity<Map<String, Boolean>> getReviewStatus(
            @PathVariable Long productId,
            Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.ok(Map.of("hasPurchased", false, "hasReviewed", false));
        }

        String email = auth.getName();
        boolean hasPurchased = reviewService.hasUserPurchased(productId, email);
        boolean hasReviewed = reviewService.hasUserReviewed(productId, email);

        return ResponseEntity.ok(Map.of("hasPurchased", hasPurchased, "hasReviewed", hasReviewed));
    }

    // ────────────────────────────────────────────────────────
    // POST create review (auth required + must have purchased)
    // ────────────────────────────────────────────────────────
    @PostMapping("/api/products/{productId}/reviews")
    public ResponseEntity<?> createReview(
            @PathVariable Long productId,
            @RequestBody ReviewRequest request,
            Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required."));
        }

        try {
            ReviewDto review = reviewService.createReview(productId, request, auth.getName());
            return new ResponseEntity<>(review, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    // PUT update own review (auth required)
    // ────────────────────────────────────────────────────────
    @PutMapping("/api/reviews/{reviewId}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long reviewId,
            @RequestBody ReviewRequest request,
            Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required."));
        }

        try {
            ReviewDto updated = reviewService.updateReview(reviewId, request, auth.getName());
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }

    // ────────────────────────────────────────────────────────
    // DELETE own review (auth required)
    // ────────────────────────────────────────────────────────
    @DeleteMapping("/api/reviews/{reviewId}")
    public ResponseEntity<?> deleteReview(
            @PathVariable Long reviewId,
            Authentication auth) {

        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authentication required."));
        }

        try {
            reviewService.deleteReview(reviewId, auth.getName());
            return ResponseEntity.ok(Map.of("message", "Review deleted successfully."));
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message", e.getMessage()));
        }
    }
}
