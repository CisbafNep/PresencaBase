package com.qrcodeback.service;

import com.qrcodeback.entity.UserEntity;
import com.qrcodeback.entity.UserRequest;
import com.qrcodeback.entity.UserResponse;

import java.util.List;

public interface UserService {


    public List<UserResponse> findAll();

    public UserResponse save(UserRequest request);

    public UserEntity findByName(String name);

    public UserResponse update(UserRequest request);

    public List<UserResponse> findByBaseName(String baseName);
    public void addPresence(UserRequest userRequest);
}

