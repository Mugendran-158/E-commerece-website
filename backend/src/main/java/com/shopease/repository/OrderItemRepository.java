package com.shopease.repository;

import com.shopease.entity.OrderItem;
import com.shopease.entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    /**
     * Returns true if the given user has at least one non-cancelled order
     * that contains the specified productId.
     */
    @Query("SELECT COUNT(oi) > 0 FROM OrderItem oi " +
           "WHERE oi.productId = :productId " +
           "AND oi.order.user.id = :userId " +
           "AND oi.order.status != :cancelledStatus")
    boolean existsByProductIdAndOrderUserIdAndOrderStatusNot(
            @Param("productId") Long productId,
            @Param("userId") Long userId,
            @Param("cancelledStatus") OrderStatus cancelledStatus);
}
