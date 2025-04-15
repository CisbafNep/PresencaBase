package com.qrcodeback.service;

import com.qrcodeback.entity.UserEntity;
import com.qrcodeback.entity.UserRequest;
import com.qrcodeback.entity.UserResponse;
import com.qrcodeback.entity.enums.BaseName;
import org.springframework.stereotype.Service;

@Service
public class UserMapper {

    public UserResponse toResponse(UserEntity user) {
        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getRole(),
                user.getFaults(),
                user.getPresences(),
                user.getFaultsFinal(),
                user.getPresencesFinal(),
                user.getBaseName()
        );
    }
    public UserEntity toEntity(UserRequest user) {
        return UserEntity.builder()
                .name(user.getName())
                .role(user.getRole())
                .presences(user.getPresences())
                .faults(user.getFaults())
                .baseName(user.getBaseName())
                .build();
    }
}
