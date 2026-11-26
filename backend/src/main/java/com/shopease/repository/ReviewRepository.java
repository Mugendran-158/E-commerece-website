package com.shopease.repository;

import com.shopease.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /** All reviews for a given product, newest first */
    List<Review> findByProductIdOrderByCreatedAtDesc(Long productId);

    /** All reviews written by a given user */
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);

    /** Check whether a user has already reviewed a specific product */
    boolean existsByUserIdAndProductId(Long userId, Long productId);

    /** Find a user's review for a specific product (for edit/duplicate check) */
    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    /** Calculate the average rating for a product */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId")
    Double findAverageRatingByProductId(@Param("productId") Long productId);

    /** Count reviews for a product */
    long countByProductId(Long productId);

    /** All reviews (admin view), newest first */
    List<Review> findAllByOrderByCreatedAtDesc();
}
