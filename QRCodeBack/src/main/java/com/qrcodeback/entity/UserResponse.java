package com.qrcodeback.entity;

import jakarta.validation.constraints.NotBlank;

import java.io.Serializable;

/**
 * DTO for {@link UserEntity}
 */
public record UserResponse(
        Long id,
        String name,
        String role,
        int faults,
        int presences,
        int faultsFinal,
        int presencesFinal,
        String baseName) implements Serializable {
}