package com.shopease.dto;

import java.math.BigDecimal;

/**
 * ProductDTO (Data Transfer Object) — used to send and receive product data via the REST API.
 * This is what the React frontend receives as JSON.
 *
 * Fields match the frontend's expectations (originalPrice, discountPrice, category as string, etc.)
 */
public class ProductDTO {

    private Long id;
    private String name;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private Double rating;
    private Integer reviewsCount;
    private String imageUrl;
    private Boolean isFeatured;

    // Category as a plain string (e.g. "Electronics", "Fashion")
    private String category;

    // Default no-args constructor (required for JSON deserialization)
    public ProductDTO() {
    }

    // Full constructor used in ProductServiceImpl to map from Product entity -> DTO
    public ProductDTO(Long id, String name, String description, BigDecimal originalPrice,
                      BigDecimal discountPrice, Integer stockQuantity, Double rating,
                      Integer reviewsCount, String imageUrl, Boolean isFeatured, String category) {
        this.id = id;
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
}
