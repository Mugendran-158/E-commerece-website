package com.shopease.controller;

import com.shopease.dto.ProductDTO;
import com.shopease.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * ProductController — exposes all product-related REST API endpoints.
 *
 * Base URL: http://localhost:8080/api/products
 *
 * Endpoints:
 *   GET    /api/products              → Get all products (supports filters)
 *   GET    /api/products/{id}         → Get product by ID
 *   GET    /api/products/featured     → Get featured products
 *   POST   /api/products              → Create a new product
 *   PUT    /api/products/{id}         → Update a product
 *   DELETE /api/products/{id}         → Delete a product
 */
@RestController
@RequestMapping("/api/products")
public class ProductController {

    // ProductService handles all the business logic
    private final ProductService productService;

    // Spring injects ProductService automatically (dependency injection)
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * GET /api/products
     * Returns a paginated list of products with optional filters.
     *
     * Query parameters (all optional):
     *   ?search=headphones      → Search by name or description
     *   ?category=Electronics   → Filter by category
     *   ?minPrice=50            → Minimum price filter
     *   ?maxPrice=300           → Maximum price filter
     *   ?sort=price_asc         → Sort: price_asc, price_desc, rating, newest
     *   ?page=0&size=12         → Pagination (0-based page number, default 12 per page)
     *
     * Response format matches what the React frontend expects:
     * {
     *   "content": [...],
     *   "totalElements": 12,
     *   "totalPages": 1,
     *   "pageNumber": 0
     * }
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Double rating,
            @RequestParam(required = false) Boolean inStock,
            @RequestParam(required = false) String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        // Get all matching products from service (with filters and sorting)
        List<ProductDTO> allProducts = productService.getProducts(search, category, minPrice, maxPrice, rating, inStock, sort);

        // Apply pagination manually (slice the list)
        int fromIndex = Math.min(page * size, allProducts.size());
        int toIndex = Math.min(fromIndex + size, allProducts.size());
        List<ProductDTO> pagedList = allProducts.subList(fromIndex, toIndex);

        // Build the paginated response object
        Map<String, Object> response = new HashMap<>();
        response.put("content", pagedList);
        response.put("totalElements", allProducts.size());
        response.put("totalPages", (int) Math.ceil((double) allProducts.size() / size));
        response.put("pageNumber", page);

        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/products/{id}
     * Returns a single product by its ID.
     * Returns 404 if the product is not found.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        ProductDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    /**
     * GET /api/products/featured
     * Returns all products where isFeatured = true.
     * Used on the homepage "Featured Products" section.
     */
    @GetMapping("/featured")
    public ResponseEntity<List<ProductDTO>> getFeaturedProducts() {
        List<ProductDTO> featuredProducts = productService.getFeaturedProducts();
        return ResponseEntity.ok(featuredProducts);
    }

    /**
     * POST /api/products
     * Creates a new product. Send product data in request body as JSON.
     * Returns 201 Created with the saved product including its generated ID.
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@RequestBody ProductDTO productDTO) {
        ProductDTO createdProduct = productService.createProduct(productDTO);
        return new ResponseEntity<>(createdProduct, HttpStatus.CREATED);
    }

    /**
     * PUT /api/products/{id}
     * Updates an existing product. Send the updated product data in request body as JSON.
     * Returns 404 if the product is not found.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long id, @RequestBody ProductDTO productDTO) {
        ProductDTO updatedProduct = productService.updateProduct(id, productDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    /**
     * DELETE /api/products/{id}
     * Deletes a product by its ID.
     * Returns 404 if the product is not found.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Product deleted successfully");
        return ResponseEntity.ok(response);
    }
}
