package com.example.back.Repository;

import com.example.back.Entity.TradeHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TradeHistoryRepository extends JpaRepository<TradeHistoryEntity, Long> {
}
