
package com.example.back.Repository;

import com.example.back.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<UsersEntity, Long> {
        //가져올때 null같은 오류방지를 위해 Optional타입으로 가져옴
        Optional<UsersEntity> findByLoginId(String loginId);

}