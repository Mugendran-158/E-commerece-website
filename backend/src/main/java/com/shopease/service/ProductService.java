package com.shopease.service;

import com.shopease.dto.ProductDTO;
import java.math.BigDecimal;
import java.util.List;

/**
 * ProductService interface — defines all product-related business operations.
 * The implementation is in ProductServiceImpl.java
 */
public interface ProductService {

    // Get all products with optional filters (search, category, price range, rating, inStock, sort order)
    List<ProductDTO> getProducts(String search, String category, BigDecimal minPrice, BigDecimal maxPrice, Double rating, Boolean inStock, String sort);

    // Overload for backwards compatibility
    default List<ProductDTO> getProducts(String search, String category, BigDecimal minPrice, BigDecimal maxPrice, String sort) {
        return getProducts(search, category, minPrice, maxPrice, null, null, sort);
    }

    // Get a single product by its ID
    ProductDTO getProductById(Long id);

    // Get all products marked as "featured"
    List<ProductDTO> getFeaturedProducts();

    // Create a new product (admin use via Postman in Phase 1)
    ProductDTO createProduct(ProductDTO productDTO);

    // Update an existing product by ID
    ProductDTO updateProduct(Long id, ProductDTO productDTO);

    // Delete a product by ID
    void deleteProduct(Long id);
}
