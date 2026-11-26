package com.shopease.repository;

import com.shopease.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * ProductRepository — handles all database operations for the Product entity.
 * Extends JpaRepository which provides built-in CRUD methods (save, findById, findAll, delete, etc.)
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // Find all products marked as "featured"
    List<Product> findByIsFeaturedTrue();

    // Custom JPQL query for filtering products by search, category, and price range
    // :search, :category, :minPrice, :maxPrice are parameters passed from the service layer
    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:category IS NULL OR LOWER(p.category) = LOWER(:category)) AND " +
           "(:minPrice IS NULL OR COALESCE(p.discountPrice, p.originalPrice) >= :minPrice) AND " +
           "(:maxPrice IS NULL OR COALESCE(p.discountPrice, p.originalPrice) <= :maxPrice) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating) AND " +
           "(:inStock IS NULL OR (:inStock = true AND p.stockQuantity > 0) OR (:inStock = false AND p.stockQuantity = 0))")
    List<Product> filterProducts(
            @Param("search") String search,
            @Param("category") String category,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minRating") Double minRating,
            @Param("inStock") Boolean inStock
    );

    @Query("SELECT DISTINCT p.category FROM Product p WHERE p.category IS NOT NULL ORDER BY p.category ASC")
    List<String> findDistinctCategories();
}
