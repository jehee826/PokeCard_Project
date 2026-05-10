package com.example.back.Repository;

import com.example.back.Entity.MarketPlaceFavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketPlaceFavoriteRepository extends JpaRepository<MarketPlaceFavoriteEntity, Long> {
    List<MarketPlaceFavoriteEntity> findByUserId(Long userId);
}
