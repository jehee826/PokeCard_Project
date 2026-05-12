package com.example.back.Repository;

import com.example.back.Entity.TradeHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TradeHistoryRepository extends JpaRepository<TradeHistoryEntity, Long> {
    List<TradeHistoryEntity> findByBuyerIdOrSellerIdOrderByTradeDateDesc(Long buyerId, Long sellerId);
}
