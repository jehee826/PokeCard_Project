package com.example.back.DTO;

import com.example.back.Entity.TradeHistoryEntity;
import lombok.*;
import java.time.LocalDateTime;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TradeHistoryDTO {
    private Long listingId;
    private Long historyId;
    private Long buyerId;
    private Long sellerId;
    private Long cardId;
    private Integer finalPrice;
    private LocalDateTime tradeDate;
    //카드정보
    private String cardNumber;
    private String cardNameKo;
    private String rarityCode;
    private String attribute;
    private String officialImageUrl;
    //해당 내역의 구매자인지 확인
    private boolean buyer;



    public static TradeHistoryDTO toDto(TradeHistoryEntity entity) {
        return TradeHistoryDTO.builder()
                .historyId(entity.getHistoryId())
                .buyerId(entity.getBuyerId())
                .sellerId(entity.getSellerId())
                .cardId(entity.getCardId())
                .finalPrice(entity.getFinalPrice())
                .tradeDate(entity.getTradeDate())
                .build();
    }

    public TradeHistoryEntity toEntity() {
        return TradeHistoryEntity.builder()
                .buyerId(this.buyerId)
                .sellerId(this.sellerId)
                .cardId(this.cardId)
                .finalPrice(this.finalPrice)
                .build();
    }
}