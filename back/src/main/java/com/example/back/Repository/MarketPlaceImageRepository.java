package com.example.back.Repository;

import com.example.back.Entity.MarketPlaceImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MarketPlaceImageRepository extends JpaRepository<MarketPlaceImageEntity, Long> {
    List<MarketPlaceImageEntity> findByListingId(Long listingId);
}
