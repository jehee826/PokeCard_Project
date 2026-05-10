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

    // 단순 알림 메시지나 상태를 담을 필드 (필요시)
    private String message;
}