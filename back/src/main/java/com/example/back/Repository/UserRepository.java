
package com.example.back.Repository;

import com.example.back.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
        //가져올때 null같은 오류방지를 위해 Optional타입으로 가져옴
        Optional<UserEntity> findByLoginId(String email);

}