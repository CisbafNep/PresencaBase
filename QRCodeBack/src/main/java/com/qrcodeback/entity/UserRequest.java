package com.qrcodeback.entity;

import com.qrcodeback.entity.enums.BaseName;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.UniqueElements;

import java.io.Serializable;

/**
 * DTO for {@link UserEntity}
 */
@Getter
@Setter
@Builder
public class UserRequest implements Serializable {
  @NotBlank
  public String name;
  @NotBlank
  public String role;
  @PositiveOrZero
  public int faults;
  @PositiveOrZero
  public int presences;
  @NotBlank
  public String baseName;
  }