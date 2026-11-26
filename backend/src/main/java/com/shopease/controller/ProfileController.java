package com.shopease.controller;

import com.shopease.dto.UserProfileDto;
import com.shopease.dto.UserProfileUpdateRequest;
import com.shopease.entity.User;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> getProfile(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authentication required"));
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + authentication.getName()));

        return ResponseEntity.ok(UserProfileDto.fromEntity(user));
    }

    @PutMapping
    @Transactional
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileUpdateRequest request,
                                          Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Authentication required"));
        }

        if (request == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Request body cannot be empty"));
        }

        // Required fields validation
        if (request.getFirstName() == null || request.getFirstName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "First name is required"));
        }

        if (request.getLastName() == null || request.getLastName().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Last name is required"));
        }

        // Phone format validation
        if (request.getPhone() != null && !request.getPhone().trim().isEmpty()) {
            String cleanedPhone = request.getPhone().trim();
            if (!cleanedPhone.matches("^\\+?[0-9]{10,15}$")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Phone number must be between 10 and 15 digits"));
            }
        }

        // Pincode format validation
        if (request.getPincode() != null && !request.getPincode().trim().isEmpty()) {
            String cleanedPincode = request.getPincode().trim();
            if (!cleanedPincode.matches("^[0-9]{5,6}$")) {
                return ResponseEntity.badRequest().body(Map.of("message", "Pincode must be 5 or 6 digits"));
            }
        }

        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + authentication.getName()));

        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());
        user.setPhone(request.getPhone() != null ? request.getPhone().trim() : null);
        user.setAddress(request.getAddress() != null ? request.getAddress().trim() : null);
        user.setCity(request.getCity() != null ? request.getCity().trim() : null);
        user.setState(request.getState() != null ? request.getState().trim() : null);
        user.setPincode(request.getPincode() != null ? request.getPincode().trim() : null);

        User saved = userRepository.save(user);
        return ResponseEntity.ok(UserProfileDto.fromEntity(saved));
    }
}
