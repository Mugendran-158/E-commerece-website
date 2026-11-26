package com.shopease.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class AnalyticsDto {

    /** Monthly revenue: [{month: "Jan 2024", revenue: 12345.00}, ...] */
    private List<Map<String, Object>> monthlyRevenue;

    /** Order count per status: [{status: "DELIVERED", count: 50}, ...] */
    private List<Map<String, Object>> ordersByStatus;

    /** Top products: [{productId, name, totalQuantity, totalRevenue}, ...] */
    private List<Map<String, Object>> topProducts;

    /** Revenue in last 7 / 30 days */
    private BigDecimal revenue7Days;
    private BigDecimal revenue30Days;

    /** Cancelled orders count */
    private long cancelledOrders;

    /** Daily sales: [{date: "2026-10-04", orderCount: 5, revenue: 1200.00}, ...] */
    private List<Map<String, Object>> dailySales;

    /** Weekly sales: [{week: "W40 2026", orderCount: 25, revenue: 7500.00}, ...] */
    private List<Map<String, Object>> weeklySales;

    /** Top categories: [{category: "Electronics", unitsSold: 40, revenue: 15000.00}, ...] */
    private List<Map<String, Object>> topCategories;

    /** Summary stats map */
    private Map<String, Object> summary;

    public AnalyticsDto() {}

    public List<Map<String, Object>> getMonthlyRevenue() { return monthlyRevenue; }
    public void setMonthlyRevenue(List<Map<String, Object>> monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

    public List<Map<String, Object>> getOrdersByStatus() { return ordersByStatus; }
    public void setOrdersByStatus(List<Map<String, Object>> ordersByStatus) { this.ordersByStatus = ordersByStatus; }

    public List<Map<String, Object>> getTopProducts() { return topProducts; }
    public void setTopProducts(List<Map<String, Object>> topProducts) { this.topProducts = topProducts; }

    public BigDecimal getRevenue7Days() { return revenue7Days; }
    public void setRevenue7Days(BigDecimal revenue7Days) { this.revenue7Days = revenue7Days; }

    public BigDecimal getRevenue30Days() { return revenue30Days; }
    public void setRevenue30Days(BigDecimal revenue30Days) { this.revenue30Days = revenue30Days; }

    public long getCancelledOrders() { return cancelledOrders; }
    public void setCancelledOrders(long cancelledOrders) { this.cancelledOrders = cancelledOrders; }

    public List<Map<String, Object>> getDailySales() { return dailySales; }
    public void setDailySales(List<Map<String, Object>> dailySales) { this.dailySales = dailySales; }

    public List<Map<String, Object>> getWeeklySales() { return weeklySales; }
    public void setWeeklySales(List<Map<String, Object>> weeklySales) { this.weeklySales = weeklySales; }

    public List<Map<String, Object>> getTopCategories() { return topCategories; }
    public void setTopCategories(List<Map<String, Object>> topCategories) { this.topCategories = topCategories; }

    public Map<String, Object> getSummary() { return summary; }
    public void setSummary(Map<String, Object> summary) { this.summary = summary; }
}
