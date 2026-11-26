package com.shopease.service;

import com.shopease.dto.AnalyticsDto;
import com.shopease.dto.DashboardStatsDto;
import com.shopease.dto.UserDto;
import com.shopease.entity.OrderStatus;
import com.shopease.repository.OrderRepository;
import com.shopease.repository.ProductRepository;
import com.shopease.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;

    public AdminService(
            ProductRepository productRepository,
            UserRepository userRepository,
            OrderRepository orderRepository
    ) {
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.orderRepository = orderRepository;
    }

    public DashboardStatsDto getDashboardStats() {
        long totalProducts = productRepository.count();
        long totalUsers = userRepository.count();
        long totalOrders = orderRepository.count();
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();

        long pendingOrders = orderRepository.countByStatus(OrderStatus.PLACED)
                + orderRepository.countByStatus(OrderStatus.CONFIRMED)
                + orderRepository.countByStatus(OrderStatus.SHIPPED)
                + orderRepository.countByStatus(OrderStatus.OUT_FOR_DELIVERY);

        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);

        return new DashboardStatsDto(
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue != null ? totalRevenue : BigDecimal.ZERO,
                pendingOrders,
                deliveredOrders
        );
    }

    public AnalyticsDto getAnalytics() {
        AnalyticsDto dto = new AnalyticsDto();

        // Monthly revenue
        List<Object[]> monthlyRaw = orderRepository.getMonthlyRevenue();
        List<Map<String, Object>> monthly = new ArrayList<>();
        for (Object[] row : monthlyRaw) {
            int year = ((Number) row[0]).intValue();
            int month = ((Number) row[1]).intValue();
            BigDecimal revenue = (BigDecimal) row[2];
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("month", Month.of(month).getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + year);
            entry.put("revenue", revenue);
            monthly.add(entry);
        }
        dto.setMonthlyRevenue(monthly);

        // Orders by status
        List<Object[]> statusRaw = orderRepository.getOrderCountByStatus();
        List<Map<String, Object>> byStatus = new ArrayList<>();
        for (Object[] row : statusRaw) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("status", row[0].toString());
            entry.put("count", ((Number) row[1]).longValue());
            byStatus.add(entry);
        }
        dto.setOrdersByStatus(byStatus);

        // Top 10 products
        List<Object[]> topRaw = orderRepository.getTopSellingProducts(10);
        List<Map<String, Object>> topProducts = new ArrayList<>();
        int limit = Math.min(topRaw.size(), 10);
        for (int i = 0; i < limit; i++) {
            Object[] row = topRaw.get(i);
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("productId", row[0]);
            entry.put("name", row[1]);
            entry.put("totalQuantity", ((Number) row[2]).longValue());
            entry.put("totalRevenue", row[3]);
            topProducts.add(entry);
        }
        dto.setTopProducts(topProducts);

        // Revenue periods
        BigDecimal rev7 = orderRepository.getRevenueLastNDays(7);
        BigDecimal rev30 = orderRepository.getRevenueLastNDays(30);
        dto.setRevenue7Days(rev7 != null ? rev7 : BigDecimal.ZERO);
        dto.setRevenue30Days(rev30 != null ? rev30 : BigDecimal.ZERO);

        // Cancelled
        long cancelledCount = orderRepository.countByStatus(OrderStatus.CANCELLED);
        dto.setCancelledOrders(cancelledCount);

        // Daily sales
        List<Object[]> dailyRaw = orderRepository.getDailySales();
        List<Map<String, Object>> daily = new ArrayList<>();
        for (Object[] row : dailyRaw) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", row[0].toString());
            entry.put("orderCount", ((Number) row[1]).longValue());
            entry.put("revenue", row[2]);
            daily.add(entry);
        }
        dto.setDailySales(daily);

        // Weekly sales
        List<Object[]> weeklyRaw = orderRepository.getWeeklySales();
        List<Map<String, Object>> weekly = new ArrayList<>();
        for (Object[] row : weeklyRaw) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("week", "W" + row[1] + " " + row[0]);
            entry.put("orderCount", ((Number) row[2]).longValue());
            entry.put("revenue", row[3]);
            weekly.add(entry);
        }
        dto.setWeeklySales(weekly);

        // Top categories
        List<Object[]> catRaw = orderRepository.getBestSellingCategories();
        List<Map<String, Object>> topCategories = new ArrayList<>();
        for (Object[] row : catRaw) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("category", row[0]);
            entry.put("unitsSold", ((Number) row[1]).longValue());
            entry.put("revenue", row[2]);
            topCategories.add(entry);
        }
        dto.setTopCategories(topCategories);

        // Summary map
        DashboardStatsDto stats = getDashboardStats();
        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("totalRevenue", stats.getTotalRevenue());
        summary.put("totalOrders", stats.getTotalOrders());
        summary.put("totalUsers", stats.getTotalUsers());
        summary.put("totalProducts", stats.getTotalProducts());
        summary.put("pendingOrders", stats.getPendingOrders());
        summary.put("deliveredOrders", stats.getDeliveredOrders());
        summary.put("cancelledOrders", cancelledCount);
        dto.setSummary(summary);

        return dto;
    }

    public Map<String, Object> getAnalyticsSummary() {
        return getAnalytics().getSummary();
    }

    public Map<String, Object> getSalesAnalytics() {
        AnalyticsDto analytics = getAnalytics();
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("dailySales", analytics.getDailySales());
        map.put("weeklySales", analytics.getWeeklySales());
        map.put("monthlySales", analytics.getMonthlyRevenue());
        return map;
    }

    public List<Map<String, Object>> getTopSellingProductsList() {
        return getAnalytics().getTopProducts();
    }

    public List<Map<String, Object>> getTopCategoriesList() {
        return getAnalytics().getTopCategories();
    }

    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }
}
