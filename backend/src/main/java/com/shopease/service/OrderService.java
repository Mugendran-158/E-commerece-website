package com.shopease.service;

import com.shopease.dto.OrderItemRequest;
import com.shopease.dto.OrderRequest;
import com.shopease.entity.Notification.NotificationType;
import com.shopease.entity.Order;
import com.shopease.entity.OrderItem;
import com.shopease.entity.OrderStatus;
import com.shopease.entity.User;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.repository.OrderRepository;
import com.shopease.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final CouponService couponService;

    public OrderService(OrderRepository orderRepository,
                        UserRepository userRepository,
                        NotificationService notificationService,
                        @Lazy CouponService couponService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
        this.couponService = couponService;
    }

    @Transactional
    public Order createOrder(OrderRequest request, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));

        String orderNumber = "ORD-" + (100000 + new Random().nextInt(900000));

        Order order = new Order(
                orderNumber,
                user,
                LocalDateTime.now(),
                request.getTotalAmount(),
                OrderStatus.PLACED,
                request.getShippingAddress(),
                request.getCity(),
                request.getState(),
                request.getPincode(),
                request.getPhone(),
                request.getPaymentMethod() != null ? request.getPaymentMethod() : "CASH_ON_DELIVERY"
        );

        if (request.getItems() != null) {
            for (OrderItemRequest itemReq : request.getItems()) {
                OrderItem item = new OrderItem(
                        itemReq.getProductId(),
                        itemReq.getProductName(),
                        itemReq.getProductImage(),
                        itemReq.getUnitPrice(),
                        itemReq.getQuantity(),
                        itemReq.getSubtotal()
                );
                order.addItem(item);
            }
        }

        Order saved = orderRepository.save(order);

        // Increment coupon usage if applied
        if (request.getCouponCode() != null && !request.getCouponCode().isBlank()) {
            couponService.incrementUsage(request.getCouponCode());
        }

        // Notify user
        notificationService.createNotification(
                user.getId(),
                "Order Placed Successfully! 🎉",
                "Your order #" + orderNumber + " has been placed. We'll confirm it shortly.",
                NotificationType.ORDER_PLACED,
                saved.getId()
        );

        return saved;
    }

    public List<Order> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userEmail));
        return orderRepository.findByUserIdOrderByOrderDateDesc(user.getId());
    }

    public Order getOrderById(Long id, String userEmail, boolean isAdmin) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));

        if (!isAdmin && !order.getUser().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("You are not authorized to view this order.");
        }

        return order;
    }

    @Transactional
    public Order cancelOrder(Long id, String userEmail, boolean isAdmin) {
        Order order = getOrderById(id, userEmail, isAdmin);

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalStateException("Delivered orders cannot be cancelled.");
        }

        order.setStatus(OrderStatus.CANCELLED);
        Order saved = orderRepository.save(order);

        // Notify user
        notificationService.createNotification(
                order.getUser().getId(),
                "Order Cancelled",
                "Your order #" + order.getOrderNumber() + " has been cancelled.",
                NotificationType.ORDER_CANCELLED,
                order.getId()
        );

        return saved;
    }

    public List<Order> getAllOrdersAdmin() {
        return orderRepository.findAllByOrderByOrderDateDesc();
    }

    @Transactional
    public Order updateOrderStatusAdmin(Long id, OrderStatus newStatus) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + id));
        order.setStatus(newStatus);
        Order saved = orderRepository.save(order);

        // Send notification to customer about status change
        String title = getStatusTitle(newStatus);
        String message = getStatusMessage(order.getOrderNumber(), newStatus);
        NotificationType type = getNotificationType(newStatus);

        notificationService.createNotification(
                order.getUser().getId(), title, message, type, order.getId()
        );

        return saved;
    }

    private String getStatusTitle(OrderStatus status) {
        return switch (status) {
            case CONFIRMED -> "Order Confirmed ✅";
            case SHIPPED -> "Order Shipped 📦";
            case OUT_FOR_DELIVERY -> "Out for Delivery 🚚";
            case DELIVERED -> "Order Delivered! 🎁";
            case CANCELLED -> "Order Cancelled";
            default -> "Order Update";
        };
    }

    private String getStatusMessage(String orderNumber, OrderStatus status) {
        return switch (status) {
            case CONFIRMED -> "Your order #" + orderNumber + " has been confirmed and is being prepared.";
            case SHIPPED -> "Your order #" + orderNumber + " has been shipped and is on its way!";
            case OUT_FOR_DELIVERY -> "Your order #" + orderNumber + " is out for delivery. Expect it today!";
            case DELIVERED -> "Your order #" + orderNumber + " has been delivered. Enjoy your purchase!";
            case CANCELLED -> "Your order #" + orderNumber + " has been cancelled.";
            default -> "Your order #" + orderNumber + " status has been updated to " + status + ".";
        };
    }

    private NotificationType getNotificationType(OrderStatus status) {
        return switch (status) {
            case CONFIRMED -> NotificationType.ORDER_CONFIRMED;
            case SHIPPED -> NotificationType.ORDER_SHIPPED;
            case OUT_FOR_DELIVERY -> NotificationType.ORDER_OUT_FOR_DELIVERY;
            case DELIVERED -> NotificationType.ORDER_DELIVERED;
            case CANCELLED -> NotificationType.ORDER_CANCELLED;
            default -> NotificationType.GENERAL;
        };
    }
}
