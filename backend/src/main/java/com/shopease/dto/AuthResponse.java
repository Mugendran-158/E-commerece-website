package com.shopease.dto;

public class AuthResponse {

    private String token;
    private String message;
    private String role;
    private UserDto user;

    public AuthResponse() {
    }

    public AuthResponse(String token, String message, String role) {
        this.token = token;
        this.message = message;
        this.role = role;
    }

    public AuthResponse(String token, String message, String role, UserDto user) {
        this.token = token;
        this.message = message;
        this.role = role;
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public UserDto getUser() {
        return user;
    }

    public void setUser(UserDto user) {
        this.user = user;
    }
}
