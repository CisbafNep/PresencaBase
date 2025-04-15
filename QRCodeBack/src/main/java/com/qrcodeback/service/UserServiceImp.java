package com.qrcodeback.service;

import com.qrcodeback.entity.UserEntity;
import com.qrcodeback.entity.UserRequest;
import com.qrcodeback.entity.UserResponse;
import com.qrcodeback.repository.UserRepository;
import jakarta.persistence.EntityExistsException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.BeanUtils;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@RequiredArgsConstructor
@Service
@Slf4j
public class UserServiceImp implements UserService {
    private final UserRepository repository;
    private final UserMapper mapper;


    public List<UserResponse> findAll() {
        return repository.findAll().stream()
                .map(user -> {
                    recalcMetrics(user);
                    return mapper.toResponse(user);
                }).toList();
    }


    public UserResponse save(UserRequest request) {
        try {
            var user = repository.save(mapper.toEntity(request));
            return mapper.toResponse(user);
        } catch (DataIntegrityViolationException e) {
            if (e.getCause() instanceof ConstraintViolationException) {
                throw new EntityExistsException("Participante duplicado");
            }
            throw e;
        }catch (NullPointerException e){
            throw new NullPointerException("Campo usuario é requerido");
        }
    }

    public UserEntity findByName(String name) {
        return repository.findByNameIgnoreCase(name)
                .orElseThrow(() -> new EntityNotFoundException("Participante não encontrado"));
    }

    public UserResponse update(UserRequest request) {
        var user = findByName(request.name);
        BeanUtils.copyProperties(request, user);
        recalcMetrics(user);
        repository.save(user);
        return mapper.toResponse(user);
    }

    @Override
    public List<UserResponse> findByBaseName(String baseName) {
        return repository.findAllByBaseName(baseName).stream()
                .map(user -> {
                    recalcMetrics(user);
                    return mapper.toResponse(user);
                }).toList();
    }

    @Override
    public void addPresence(UserRequest userRequest) {
        var user = findByName(userRequest.name);
        user.setPresences(user.getPresences() + 1);
        repository.save(user);
    }

    private void recalcMetrics(UserEntity user) {
        int presences = user.getPresences();
        int faults = user.getFaults();
        int parCombinado = Math.min(presences, faults);

        int presenciasRestantes = presences - parCombinado;
        int faltasRestantes = faults - parCombinado;

        int presencasPares = presenciasRestantes / 2;
        int faltasPares = faltasRestantes / 2;

        int effectivePresence = parCombinado + presencasPares + faltasPares;

        user.setPresencesFinal(effectivePresence);
        user.setFaultsFinal(faltasPares);
        log.info(String.valueOf(faltasPares));
    }

}

