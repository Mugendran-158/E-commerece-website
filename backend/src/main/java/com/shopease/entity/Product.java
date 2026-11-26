package com.shopease.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Product entity — maps to the 'products' table in MySQL.
 * Stores all product details including name, description, price, category, etc.
 */
@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    // Original (MRP) price of the product
    @Column(name = "original_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal originalPrice;

    // Sale / discounted price (can be null if no discount)
    @Column(name = "discount_price", precision = 10, scale = 2)
    private BigDecimal discountPrice;

    // Number of items available in stock
    @Column(name = "stock_quantity", nullable = false)
    private Integer stockQuantity = 0;

    // Product rating out of 5.0
    private Double rating = 4.8;

    // Number of customer reviews
    @Column(name = "reviews_count")
    private Integer reviewsCount = 0;

    // URL to the product image
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // Whether this product should show in the "featured" section
    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    // Category stored as a plain text string (e.g. "Electronics", "Fashion")
    @Column(name = "category")
    private String category;

    // Timestamp set automatically when the product is first saved
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Default no-args constructor required by JPA
    public Product() {
    }

    // Convenience constructor for seeding initial data
    public Product(String name, String description, BigDecimal originalPrice,
                   BigDecimal discountPrice, Integer stockQuantity, Double rating,
                   Integer reviewsCount, String imageUrl, Boolean isFeatured, String category) {
        this.name = name;
        this.description = description;
        this.originalPrice = originalPrice;
        this.discountPrice = discountPrice;
        this.stockQuantity = stockQuantity;
        this.rating = rating;
        this.reviewsCount = reviewsCount;
        this.imageUrl = imageUrl;
        this.isFeatured = isFeatured;
        this.category = category;
    }

    // Called automatically before the first INSERT
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // -------- Getters and Setters --------

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(BigDecimal originalPrice) {
        this.originalPrice = originalPrice;
    }

    public BigDecimal getDiscountPrice() {
        return discountPrice;
    }

    public void setDiscountPrice(BigDecimal discountPrice) {
        this.discountPrice = discountPrice;
    }

    public Integer getStockQuantity() {
        return stockQuantity;
    }

    public void setStockQuantity(Integer stockQuantity) {
        this.stockQuantity = stockQuantity;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewsCount() {
        return reviewsCount;
    }

    public void setReviewsCount(Integer reviewsCount) {
        this.reviewsCount = reviewsCount;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Boolean getIsFeatured() {
        return isFeatured;
    }

    public void setIsFeatured(Boolean isFeatured) {
        this.isFeatured = isFeatured;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
