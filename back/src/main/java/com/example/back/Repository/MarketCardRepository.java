package com.example.back.Repository;

import com.example.back.Entity.MarketCardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketCardRepository extends JpaRepository<MarketCardEntity, Long> {
}
