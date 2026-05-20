package com.example.back.DTO;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class MarketPlaceFavoriteDTO {
    private Long favoriteId;
    private Long userId;
    private Long listingId;
    private String message;
}