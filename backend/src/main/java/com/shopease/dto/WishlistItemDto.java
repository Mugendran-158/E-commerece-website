package com.shopease.dto;

import com.shopease.entity.Product;
import com.shopease.entity.WishlistItem;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class WishlistItemDto {

    private Long id;
    private Long productId;
    private String productName;
    private String description;
    private BigDecimal originalPrice;
    private BigDecimal discountPrice;
    private Integer stockQuantity;
    private Double rating;
    private Integer reviewsCount;
    private String imageUrl;
    private String category;
    private LocalDateTime createdAt;
    private ProductDTO product;

    public WishlistItemDto() {
    }

    public static WishlistItemDto fromEntity(WishlistItem item) {
        if (item == null) return null;
        WishlistItemDto dto = new WishlistItemDto();
        dto.setId(item.getId());
        dto.setCreatedAt(item.getCreatedAt());

        Product p = item.getProduct();
        if (p != null) {
            dto.setProductId(p.getId());
            dto.setProductName(p.getName());
            dto.setDescription(p.getDescription());
            dto.setOriginalPrice(p.getOriginalPrice());
            dto.setDiscountPrice(p.getDiscountPrice());
            dto.setStockQuantity(p.getStockQuantity());
            dto.setRating(p.getRating());
            dto.setReviewsCount(p.getReviewsCount());
            dto.setImageUrl(p.getImageUrl());
            dto.setCategory(p.getCategory());

            ProductDTO prodDto = new ProductDTO(
                    p.getId(),
                    p.getName(),
                    p.getDescription(),
                    p.getOriginalPrice(),
                    p.getDiscountPrice(),
                    p.getStockQuantity(),
                    p.getRating(),
                    p.getReviewsCount(),
                    p.getImageUrl(),
                    p.getIsFeatured(),
                    p.getCategory()
            );
            dto.setProduct(prodDto);
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public ProductDTO getProduct() {
        return product;
    }

    public void setProduct(ProductDTO product) {
        this.product = product;
    }
}
