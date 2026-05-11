package com.example.back.Repository;

import com.example.back.Entity.UserCollectionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface UserCollectionsRepository extends JpaRepository<UserCollectionsEntity, Long> {

    boolean existsByUserIdAndCardId(Long userId, Long cardId);

    @Query(value = "SELECT c.card_id, c.card_number, c.card_name_ko, c.attribute, c.official_image_url " +
            "FROM user_collections uc " +
            "JOIN cards c ON uc.card_id = c.card_id " +
            "WHERE uc.user_id = (SELECT user_id FROM users WHERE login_id = :loginId)",
            nativeQuery = true)
    List<Object[]> findMyCardsByLoginId(@Param("loginId") String loginId);

}
