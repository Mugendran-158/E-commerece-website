package com.shopease.service;

import com.shopease.dto.WishlistItemDto;
import com.shopease.entity.Product;
import com.shopease.entity.User;
import com.shopease.entity.WishlistItem;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import com.shopease.repository.WishlistItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WishlistService {

    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public WishlistItemDto addToWishlist(Long productId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        if (wishlistItemRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new IllegalStateException("Product is already in your wishlist");
        }

        WishlistItem item = new WishlistItem(user, product);
        WishlistItem saved = wishlistItemRepository.save(item);
        return WishlistItemDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<WishlistItemDto> getWishlist(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return wishlistItemRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(WishlistItemDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeFromWishlist(Long productId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        WishlistItem item = wishlistItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found in your wishlist"));

        wishlistItemRepository.delete(item);
    }

    @Transactional(readOnly = true)
    public boolean isInWishlist(Long productId, String userEmail) {
        if (userEmail == null) return false;
        return userRepository.findByEmail(userEmail)
                .map(user -> wishlistItemRepository.existsByUserIdAndProductId(user.getId(), productId))
                .orElse(false);
    }
}
