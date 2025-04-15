package com.qrcodeback.controller;

import com.qrcodeback.entity.UserEntity;
import com.qrcodeback.entity.UserRequest;
import com.qrcodeback.entity.UserResponse;
import com.qrcodeback.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserService service;

    @GetMapping
    public ResponseEntity<List<UserResponse>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{name}")
    public ResponseEntity<UserEntity> findByName(@PathVariable String name) {
        return ResponseEntity.ok(service.findByName(name));
    }

    @PostMapping
    public ResponseEntity<UserResponse> save(@RequestBody UserRequest request) {
        String name = request.getName();
        request.setName(name.trim().replaceAll("\\s+", " "));
        System.out.println(request.getName());
        var save = service.save(request);
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{name}")
                .buildAndExpand(request.getName())
                .toUri();

        return ResponseEntity.created(location).body(save);
    }

    @PutMapping
    public ResponseEntity<UserResponse> update(@RequestBody UserRequest request) {
        return ResponseEntity.ok(service.update(request));
    }
    @PutMapping("/presence")
    public ResponseEntity<Void> addPresence(@RequestBody UserRequest request) {
        service.addPresence(request);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/base/{baseName}")
    public ResponseEntity<List<UserResponse>> findByBaseName(@PathVariable String baseName) {
        return ResponseEntity.ok(service.findByBaseName(baseName));
    }
}
