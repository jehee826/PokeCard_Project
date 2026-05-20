
package com.example.back.Repository;

import com.example.back.Entity.UsersEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<UsersEntity, Long> {
        //가져올때 null같은 오류방지를 위해 Optional타입으로 가져옴
        Optional<UsersEntity> findByLoginId(String loginId);

        //05/17 sellerId 조회용 추가함
        @Query("SELECT u.loginId FROM UsersEntity u WHERE u.id = :sellerId")
        Optional<String> findLoginIdById(@Param("sellerId") Long sellerId);
}