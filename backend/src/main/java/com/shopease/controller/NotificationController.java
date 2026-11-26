package com.shopease.controller;

import com.shopease.dto.NotificationDto;
import com.shopease.entity.User;
import com.shopease.repository.UserRepository;
import com.shopease.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService, UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private Long getCurrentUserId(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getId();
    }

    /** GET /api/notifications — list all notifications for current user */
    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(Authentication auth) {
        return ResponseEntity.ok(notificationService.getUserNotifications(getCurrentUserId(auth)));
    }

    /** GET /api/notifications/unread-count */
    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication auth) {
        long count = notificationService.getUnreadCount(getCurrentUserId(auth));
        return ResponseEntity.ok(Map.of("count", count));
    }

    /** PUT /api/notifications/read-all */
    @PutMapping({"/read-all", "/mark-all-read"})
    public ResponseEntity<Map<String, String>> markAllRead(Authentication auth) {
        notificationService.markAllRead(getCurrentUserId(auth));
        return ResponseEntity.ok(Map.of("message", "All notifications marked as read."));
    }

    /** PUT /api/notifications/{id}/read — mark single notification read */
    @PutMapping("/{id}/read")
    public ResponseEntity<NotificationDto> markRead(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(notificationService.markRead(id, getCurrentUserId(auth)));
    }

    /** DELETE /api/notifications/{id} */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteNotification(@PathVariable Long id, Authentication auth) {
        notificationService.deleteNotification(id, getCurrentUserId(auth));
        return ResponseEntity.ok(Map.of("message", "Notification deleted."));
    }
}
