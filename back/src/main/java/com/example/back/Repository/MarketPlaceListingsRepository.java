package com.example.back.Repository;

import com.example.back.Entity.MarketPlaceListingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MarketPlaceListingsRepository extends JpaRepository<MarketPlaceListingsEntity, Long> {
    @Query(value = "SELECT DISTINCT card_id FROM marketplace_listings", nativeQuery = true)
    List<Long> getDistinctCardId();

    List<MarketPlaceListingsEntity> findByCardId(Long cardId);
    List<MarketPlaceListingsEntity> findBySellerId(Long sellerId);
}

