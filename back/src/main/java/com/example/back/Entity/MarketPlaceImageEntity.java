package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "marketplace_image")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketPlaceImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id", nullable = false)
    private Long imageId;

    @Column(name = "listing_id", nullable = false)
    private Long listingId;

    @Column(name = "image_path", nullable = false, length = 500)
    private String imagePath;
}