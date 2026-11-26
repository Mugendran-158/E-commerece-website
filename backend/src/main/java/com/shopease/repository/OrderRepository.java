package com.shopease.repository;

import com.shopease.entity.Order;
import com.shopease.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByOrderDateDesc(Long userId);

    List<Order> findAllByOrderByOrderDateDesc();

    long countByStatus(OrderStatus status);

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status != 'CANCELLED'")
    BigDecimal sumTotalRevenue();

    // ─── Analytics ────────────────────────────────────────────────────────────

    /** Revenue grouped by month: [year, month, revenue] */
    @Query("SELECT YEAR(o.orderDate), MONTH(o.orderDate), COALESCE(SUM(o.totalAmount), 0) " +
           "FROM Order o WHERE o.status != 'CANCELLED' " +
           "GROUP BY YEAR(o.orderDate), MONTH(o.orderDate) " +
           "ORDER BY YEAR(o.orderDate) ASC, MONTH(o.orderDate) ASC")
    List<Object[]> getMonthlyRevenue();

    /** Order count grouped by status */
    @Query("SELECT o.status, COUNT(o) FROM Order o GROUP BY o.status")
    List<Object[]> getOrderCountByStatus();

    /** Top selling products by quantity: [productId, productName, totalQty, totalRevenue] */
    @Query("SELECT oi.productId, oi.productName, SUM(oi.quantity), SUM(oi.subtotal) " +
           "FROM OrderItem oi JOIN oi.order o WHERE o.status != 'CANCELLED' " +
           "GROUP BY oi.productId, oi.productName " +
           "ORDER BY SUM(oi.quantity) DESC")
    List<Object[]> getTopSellingProducts(@Param("limit") int limit);

    /** Recent revenue for a given number of days */
    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o " +
           "WHERE o.status != 'CANCELLED' AND o.orderDate >= CURRENT_TIMESTAMP - :days DAY")
    BigDecimal getRevenueLastNDays(@Param("days") int days);

    /** Daily sales: [date, orderCount, revenue] */
    @Query(value = "SELECT DATE(order_date) as dt, COUNT(*) as cnt, COALESCE(SUM(total_amount), 0) as rev " +
           "FROM orders WHERE status != 'CANCELLED' " +
           "GROUP BY DATE(order_date) ORDER BY dt DESC LIMIT 14", nativeQuery = true)
    List<Object[]> getDailySales();

    /** Weekly sales: [year, week, orderCount, revenue] */
    @Query(value = "SELECT YEAR(order_date) as yr, WEEK(order_date) as wk, COUNT(*) as cnt, COALESCE(SUM(total_amount), 0) as rev " +
           "FROM orders WHERE status != 'CANCELLED' " +
           "GROUP BY yr, wk ORDER BY yr DESC, wk DESC LIMIT 8", nativeQuery = true)
    List<Object[]> getWeeklySales();

    /** Best selling categories: [category, unitsSold, totalRevenue] */
    @Query(value = "SELECT COALESCE(p.category, 'Uncategorized') as cat, COALESCE(SUM(oi.quantity), 0) as units_sold, COALESCE(SUM(oi.subtotal), 0) as rev " +
           "FROM order_items oi JOIN products p ON oi.product_id = p.id JOIN orders o ON oi.order_id = o.id " +
           "WHERE o.status != 'CANCELLED' " +
           "GROUP BY cat ORDER BY units_sold DESC LIMIT 10", nativeQuery = true)
    List<Object[]> getBestSellingCategories();
}
