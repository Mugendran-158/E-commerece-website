package com.shopease.service;

import com.shopease.dto.NotificationDto;
import com.shopease.entity.Notification;
import com.shopease.entity.Notification.NotificationType;
import com.shopease.entity.User;
import com.shopease.repository.NotificationRepository;
import com.shopease.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /** Create a notification for a user (called internally by other services). */
    @Transactional
    public void createNotification(Long userId, String title, String message,
                                    NotificationType type, Long referenceId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return;
        Notification n = new Notification(user, title, message, type, referenceId);
        notificationRepository.save(n);
    }

    /** Get all notifications for the authenticated user, newest first. */
    public List<NotificationDto> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(NotificationDto::fromEntity)
                .collect(Collectors.toList());
    }

    /** Count unread notifications for a user. */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }

    /** Mark all notifications as read for the authenticated user. */
    @Transactional
    public void markAllRead(Long userId) {
        notificationRepository.markAllReadByUserId(userId);
    }

    /** Mark a single notification as read. */
    @Transactional
    public NotificationDto markRead(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!n.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        n.setRead(true);
        return NotificationDto.fromEntity(notificationRepository.save(n));
    }

    /** Delete a notification (owner only). */
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!n.getUser().getId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }
        notificationRepository.delete(n);
    }
}
