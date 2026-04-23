
package com.example.back.Repository;

import com.example.back.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
        Optional<UserEntity> findByLoginId(String email);

}