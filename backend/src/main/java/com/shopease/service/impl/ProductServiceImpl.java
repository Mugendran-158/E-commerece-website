package com.shopease.service.impl;

import com.shopease.dto.ProductDTO;
import com.shopease.entity.Product;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.repository.ProductRepository;
import com.shopease.service.ProductService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ProductServiceImpl — contains all the business logic for product operations.
 * This class implements the ProductService interface.
 *
 * @Transactional ensures database operations are wrapped in a transaction
 * (auto-rollback on error).
 */
@Service
public class ProductServiceImpl implements ProductService {

    // Spring automatically injects the ProductRepository bean here
    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * Converts a Product entity (database row) into a ProductDTO (JSON response).
     * This prevents leaking internal entity details to the frontend.
     */
    private ProductDTO toDTO(Product product) {
        return new ProductDTO(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getOriginalPrice(),
                product.getDiscountPrice(),
                product.getStockQuantity(),
                product.getRating(),
                product.getReviewsCount(),
                product.getImageUrl(),
                product.getIsFeatured(),
                product.getCategory()
        );
    }

    /**
     * Get all products with optional filters.
     * Uses the filterProducts JPQL query from ProductRepository for search/category/price filters.
     * Then applies sorting in Java.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getProducts(String search, String category, BigDecimal minPrice, BigDecimal maxPrice, Double rating, Boolean inStock, String sort) {
        // Clean up the filter parameters (treat empty strings as null = no filter)
        String cleanSearch = (search != null && !search.trim().isEmpty()) ? search.trim() : null;
        String cleanCategory = (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("All")) ? category.trim() : null;

        // Fetch from database using the JPQL filter query with rating and inStock
        List<Product> products = productRepository.filterProducts(cleanSearch, cleanCategory, minPrice, maxPrice, rating, inStock);

        // Apply sorting if a sort parameter was provided
        if (sort != null) {
            String s = sort.trim().toLowerCase();
            switch (s) {
                case "priceasc":
                case "price_asc":
                case "low_to_high":
                    products.sort(Comparator.comparing(p -> p.getDiscountPrice() != null ? p.getDiscountPrice() : p.getOriginalPrice()));
                    break;
                case "pricedesc":
                case "price_desc":
                case "high_to_low":
                    products.sort((p1, p2) -> {
                        BigDecimal price1 = p1.getDiscountPrice() != null ? p1.getDiscountPrice() : p1.getOriginalPrice();
                        BigDecimal price2 = p2.getDiscountPrice() != null ? p2.getDiscountPrice() : p2.getOriginalPrice();
                        return price2.compareTo(price1);
                    });
                    break;
                case "rating":
                case "ratingdesc":
                case "rating_desc":
                    products.sort(Comparator.comparing(Product::getRating, Comparator.nullsLast(Comparator.reverseOrder())));
                    break;
                case "newest":
                    products.sort(Comparator.comparing(Product::getId).reversed());
                    break;
                default:
                    break;
            }
        }

        // Convert each Product entity to a ProductDTO and return the list
        return products.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Get a single product by ID.
     * Throws ResourceNotFoundException (404) if the product doesn't exist.
     */
    @Override
    @Transactional(readOnly = true)
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        return toDTO(product);
    }

    /**
     * Get all products marked as featured (isFeatured = true).
     * Used for the "Featured Products" section on the homepage.
     */
    @Override
    @Transactional(readOnly = true)
    public List<ProductDTO> getFeaturedProducts() {
        return productRepository.findByIsFeaturedTrue()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Create a new product and save it to the database.
     * Returns the saved product with the database-generated ID.
     */
    @Override
    @Transactional
    public ProductDTO createProduct(ProductDTO dto) {
        Product product = new Product(
                dto.getName(),
                dto.getDescription(),
                dto.getOriginalPrice(),
                dto.getDiscountPrice(),
                dto.getStockQuantity() != null ? dto.getStockQuantity() : 0,
                dto.getRating() != null ? dto.getRating() : 4.8,
                dto.getReviewsCount() != null ? dto.getReviewsCount() : 0,
                dto.getImageUrl(),
                dto.getIsFeatured() != null ? dto.getIsFeatured() : false,
                dto.getCategory()
        );

        Product savedProduct = productRepository.save(product);
        return toDTO(savedProduct);
    }

    /**
     * Update an existing product by ID.
     * Throws ResourceNotFoundException (404) if the product doesn't exist.
     */
    @Override
    @Transactional
    public ProductDTO updateProduct(Long id, ProductDTO dto) {
        // Find the existing product (throws 404 if not found)
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));

        // Update the fields with the new values from the request body
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setOriginalPrice(dto.getOriginalPrice());
        product.setDiscountPrice(dto.getDiscountPrice());
        if (dto.getStockQuantity() != null) product.setStockQuantity(dto.getStockQuantity());
        if (dto.getRating() != null) product.setRating(dto.getRating());
        if (dto.getImageUrl() != null) product.setImageUrl(dto.getImageUrl());
        if (dto.getIsFeatured() != null) product.setIsFeatured(dto.getIsFeatured());
        if (dto.getCategory() != null) product.setCategory(dto.getCategory());

        Product updatedProduct = productRepository.save(product);
        return toDTO(updatedProduct);
    }

    /**
     * Delete a product by ID.
     * Throws ResourceNotFoundException (404) if the product doesn't exist.
     */
    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
        productRepository.delete(product);
    }
}
