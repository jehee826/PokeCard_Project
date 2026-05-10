package com.example.back.Repository;

import com.example.back.Entity.MarketPlaceFavoriteEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MarketPlaceFavoriteRepository extends JpaRepository<MarketPlaceFavoriteEntity, Long> {
    List<MarketPlaceFavoriteEntity> findByUserId(Long userId);

    //userId와 listingId를 통해 특정 행 한개만 찾기
    Optional<MarketPlaceFavoriteEntity> findByUserIdAndListingId(Long userId, Long listingId);

    //데이터 존재 여부 확인(즐찾 확인용)
    boolean existsByUserIdAndListingId(Long userId, Long listingId);
}
