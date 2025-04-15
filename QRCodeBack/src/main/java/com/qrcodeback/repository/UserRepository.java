package com.qrcodeback.repository;

import com.qrcodeback.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByNameIgnoreCase(String name);

    List<UserEntity> findAllByBaseName(String baseName);
}
