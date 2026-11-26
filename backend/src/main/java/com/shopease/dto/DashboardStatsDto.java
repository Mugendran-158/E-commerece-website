package com.shopease.dto;

import java.math.BigDecimal;

public class DashboardStatsDto {

    private long totalProducts;
    private long totalUsers;
    private long totalOrders;
    private BigDecimal totalRevenue;
    private long pendingOrders;
    private long deliveredOrders;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalProducts, long totalUsers, long totalOrders, BigDecimal totalRevenue, long pendingOrders, long deliveredOrders) {
        this.totalProducts = totalProducts;
        this.totalUsers = totalUsers;
        this.totalOrders = totalOrders;
        this.totalRevenue = totalRevenue;
        this.pendingOrders = pendingOrders;
        this.deliveredOrders = deliveredOrders;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getDeliveredOrders() {
        return deliveredOrders;
    }

    public void setDeliveredOrders(long deliveredOrders) {
        this.deliveredOrders = deliveredOrders;
    }
}
