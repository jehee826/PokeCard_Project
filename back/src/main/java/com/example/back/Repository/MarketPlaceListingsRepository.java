package com.example.back.Repository;

import com.example.back.Entity.MarketPlaceListingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MarketPlaceListingsRepository extends JpaRepository<MarketPlaceListingsEntity, Long> {
}
