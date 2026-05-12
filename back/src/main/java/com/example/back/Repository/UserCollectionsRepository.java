package com.example.back.Repository;

import com.example.back.Entity.CardsEntity;
import com.example.back.Entity.UserCollectionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserCollectionsRepository extends JpaRepository<UserCollectionsEntity, Long> {

    boolean existsByUserIdAndCardId(Long userId, Long cardId);

    //JPQL사용
    @Query("SELECT uc.card FROM UserCollectionsEntity uc " +
            "WHERE uc.user.loginId = :loginId")
    List<CardsEntity> findMyCardsByLoginId(@Param("loginId") String loginId);

}
