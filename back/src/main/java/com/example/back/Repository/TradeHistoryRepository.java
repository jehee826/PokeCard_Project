package com.example.back.Repository;

import com.example.back.Entity.TradeHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TradeHistoryRepository extends JpaRepository<TradeHistoryEntity, Long> {
    List<TradeHistoryEntity> findByBuyerIdOrSellerIdOrderByTradeDateDesc(Long buyerId, Long sellerId);
    Optional<TradeHistoryEntity> findByListingIdAndCardIdAndBuyerId(Long listingId, Long cardId, Long buyerId);
}
