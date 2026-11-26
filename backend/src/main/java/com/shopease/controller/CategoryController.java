package com.shopease.controller;

import com.shopease.entity.Product;
import com.shopease.repository.ProductRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final ProductRepository productRepository;

    private static final Map<String, String> CATEGORY_IMAGES = Map.of(
            "Electronics", "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
            "Fashion", "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80",
            "Shoes", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80",
            "Beauty", "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80",
            "Home & Kitchen", "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80",
            "Home", "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
            "Accessories", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
            "Sports & Fitness", "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&auto=format&fit=crop&q=80"
    );

    public CategoryController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        List<String> categoryNames = productRepository.findDistinctCategories();
        List<Product> allProducts = productRepository.findAll();

        Map<String, Long> countMap = new HashMap<>();
        for (Product p : allProducts) {
            if (p.getCategory() != null) {
                countMap.put(p.getCategory(), countMap.getOrDefault(p.getCategory(), 0L) + 1);
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        long id = 1;
        for (String cat : categoryNames) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", id++);
            map.put("name", cat);
            map.put("description", "Browse our curated collection of " + cat);
            map.put("imageUrl", CATEGORY_IMAGES.getOrDefault(cat, "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80"));
            map.put("itemCount", countMap.getOrDefault(cat, 0L));
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }
}
