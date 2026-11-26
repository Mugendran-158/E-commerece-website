package com.shopease.dto;

import com.shopease.entity.Notification;
import com.shopease.entity.Notification.NotificationType;

import java.time.LocalDateTime;

public class NotificationDto {

    private Long id;
    private String title;
    private String message;
    private NotificationType type;
    private Long referenceId;
    private boolean isRead;
    private LocalDateTime createdAt;

    public NotificationDto() {}

    public static NotificationDto fromEntity(Notification n) {
        NotificationDto dto = new NotificationDto();
        dto.id = n.getId();
        dto.title = n.getTitle();
        dto.message = n.getMessage();
        dto.type = n.getType();
        dto.referenceId = n.getReferenceId();
        dto.isRead = n.isRead();
        dto.createdAt = n.getCreatedAt();
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public NotificationType getType() { return type; }
    public void setType(NotificationType type) { this.type = type; }

    public Long getReferenceId() { return referenceId; }
    public void setReferenceId(Long referenceId) { this.referenceId = referenceId; }

    public boolean isRead() { return isRead; }
    public void setRead(boolean read) { isRead = read; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
