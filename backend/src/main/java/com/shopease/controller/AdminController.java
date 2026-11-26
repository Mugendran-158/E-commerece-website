package com.shopease.controller;

import com.shopease.dto.AnalyticsDto;
import com.shopease.dto.DashboardStatsDto;
import com.shopease.dto.OrderStatusUpdateRequest;
import com.shopease.dto.ReviewDto;
import com.shopease.dto.UserDto;
import com.shopease.entity.Order;
import com.shopease.entity.OrderStatus;
import com.shopease.service.AdminService;
import com.shopease.service.OrderService;
import com.shopease.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final OrderService orderService;
    private final ReviewService reviewService;

    public AdminController(AdminService adminService, OrderService orderService, ReviewService reviewService) {
        this.adminService = adminService;
        this.orderService = orderService;
        this.reviewService = reviewService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDto> getDashboardStatsAlias() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/analytics")
    public ResponseEntity<AnalyticsDto> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/analytics/summary")
    public ResponseEntity<Map<String, Object>> getAnalyticsSummary() {
        return ResponseEntity.ok(adminService.getAnalyticsSummary());
    }

    @GetMapping("/analytics/sales")
    public ResponseEntity<Map<String, Object>> getSalesAnalytics() {
        return ResponseEntity.ok(adminService.getSalesAnalytics());
    }

    @GetMapping("/analytics/top-products")
    public ResponseEntity<List<Map<String, Object>>> getTopProducts() {
        return ResponseEntity.ok(adminService.getTopSellingProductsList());
    }

    @GetMapping("/analytics/top-categories")
    public ResponseEntity<List<Map<String, Object>>> getTopCategories() {
        return ResponseEntity.ok(adminService.getTopCategoriesList());
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        List<Order> orders = orderService.getAllOrdersAdmin();
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/orders/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Order order = orderService.getOrderById(id, null, true);
        return ResponseEntity.ok(order);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody OrderStatusUpdateRequest request
    ) {
        OrderStatus newStatus = OrderStatus.valueOf(request.getStatus().toUpperCase());
        Order updatedOrder = orderService.updateOrderStatusAdmin(id, newStatus);
        return ResponseEntity.ok(updatedOrder);
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    // ────────────────────────────────────────────
    // Admin Review Management
    // ────────────────────────────────────────────

    @GetMapping("/reviews")
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        List<ReviewDto> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/reviews/{reviewId}")
    public ResponseEntity<Map<String, String>> adminDeleteReview(@PathVariable Long reviewId) {
        reviewService.adminDeleteReview(reviewId);
        return ResponseEntity.ok(Map.of("message", "Review deleted by admin."));
    }
}
