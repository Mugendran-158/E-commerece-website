package com.shopease.service;

import com.shopease.dto.ReviewDto;
import com.shopease.dto.ReviewRequest;
import com.shopease.entity.*;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.repository.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository,
                         OrderItemRepository orderItemRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
    }

    // ────────────────────────────────────────────
    // Helper: convert Review entity → ReviewDto
    // ────────────────────────────────────────────
    private ReviewDto toDto(Review review) {
        String userName = review.getUser().getFirstName() + " " + review.getUser().getLastName();
        return new ReviewDto(
                review.getId(),
                review.getUser().getId(),
                userName,
                review.getProduct().getId(),
                review.getProduct().getName(),
                review.getRating(),
                review.getComment(),
                review.getCreatedAt()
        );
    }

    // ────────────────────────────────────────────
    // Helper: recalculate & persist product rating
    // ────────────────────────────────────────────
    private void updateProductRating(Product product) {
        Double avg = reviewRepository.findAverageRatingByProductId(product.getId());
        long count = reviewRepository.countByProductId(product.getId());
        product.setRating(avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0);
        product.setReviewsCount((int) count);
        productRepository.save(product);
    }

    // ────────────────────────────────────────────
    // GET reviews for a product
    // ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByProduct(Long productId) {
        // Verify product exists
        productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        return reviewRepository.findByProductIdOrderByCreatedAtDesc(productId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ────────────────────────────────────────────
    // GET reviews by current user
    // ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<ReviewDto> getReviewsByUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ────────────────────────────────────────────
    // CREATE review
    // ────────────────────────────────────────────
    @Transactional
    public ReviewDto createReview(Long productId, ReviewRequest request, String userEmail) {
        // Validate rating
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
        // Validate comment
        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment is required.");
        }

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        // Purchase validation
        boolean hasPurchased = orderItemRepository.existsByProductIdAndOrderUserIdAndOrderStatusNot(
                productId, user.getId(), OrderStatus.CANCELLED);
        if (!hasPurchased) {
            throw new IllegalStateException("You can review this product only after purchasing it.");
        }

        // Duplicate review check
        if (reviewRepository.existsByUserIdAndProductId(user.getId(), productId)) {
            throw new IllegalStateException("You have already reviewed this product.");
        }

        Review review = new Review(user, product, request.getRating(), request.getComment().trim());
        Review saved = reviewRepository.save(review);

        // Update product rating
        updateProductRating(product);

        return toDto(saved);
    }

    // ────────────────────────────────────────────
    // UPDATE review (owner only)
    // ────────────────────────────────────────────
    @Transactional
    public ReviewDto updateReview(Long reviewId, ReviewRequest request, String userEmail) {
        // Validate rating
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }
        // Validate comment
        if (request.getComment() == null || request.getComment().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment is required.");
        }

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Authorization: only owner can edit
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to edit this review.");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment().trim());
        Review updated = reviewRepository.save(review);

        // Update product rating
        updateProductRating(review.getProduct());

        return toDto(updated);
    }

    // ────────────────────────────────────────────
    // DELETE review (owner only)
    // ────────────────────────────────────────────
    @Transactional
    public void deleteReview(Long reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        // Authorization: only owner can delete
        if (!review.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to delete this review.");
        }

        Product product = review.getProduct();
        reviewRepository.delete(review);

        // Update product rating
        updateProductRating(product);
    }

    // ────────────────────────────────────────────
    // ADMIN: get all reviews
    // ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public List<ReviewDto> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ────────────────────────────────────────────
    // ADMIN: delete any review
    // ────────────────────────────────────────────
    @Transactional
    public void adminDeleteReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        Product product = review.getProduct();
        reviewRepository.delete(review);

        // Update product rating after admin deletion
        updateProductRating(product);
    }

    // ────────────────────────────────────────────
    // Check if user has already reviewed a product (used by frontend)
    // ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public boolean hasUserReviewed(Long productId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return reviewRepository.existsByUserIdAndProductId(user.getId(), productId);
    }

    // ────────────────────────────────────────────
    // Check if user has purchased the product (used by frontend)
    // ────────────────────────────────────────────
    @Transactional(readOnly = true)
    public boolean hasUserPurchased(Long productId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return orderItemRepository.existsByProductIdAndOrderUserIdAndOrderStatusNot(
                productId, user.getId(), OrderStatus.CANCELLED);
    }
}
