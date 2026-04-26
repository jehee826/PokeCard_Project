package com.example.back.DTO;

import com.example.back.Entity.CardsEntity;
import com.example.back.Entity.MarketPlaceListingsEntity;
import lombok.*;

@ToString//로그찍기용
@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MarketPlaceListingsDTO {

    private Long listingId;
    private Long sellerId;
    private Long cardId;
    private Integer price;
    private String contactInfo;
    private String location;
    //card_id를 통해 조인한 cards테이블의 정보를 잠깐 담을 변수들
    private String cardNameKo;
    private String cardNumber;
    private String attribute;
    private String officialImageUrl;


    public static MarketPlaceListingsDTO toDto(MarketPlaceListingsEntity entity, CardsEntity cardEntity){
        return MarketPlaceListingsDTO.builder()
                .listingId(entity.getListingId())
                .sellerId(entity.getSellerId())
                .cardId(entity.getCardId())
                .price(entity.getPrice())
                .contactInfo(entity.getContactInfo())
                .location(entity.getLocation())
                // 카드 정보 안전하게 채우기
                .cardNameKo(cardEntity != null ? cardEntity.getCardNameKo() : null)
                .cardNumber(cardEntity != null ? cardEntity.getCardNumber() : null)
                .attribute(cardEntity != null ? cardEntity.getAttribute() : null)
                .officialImageUrl(cardEntity != null ? cardEntity.getOfficialImageUrl() : null)
                .build();
    }

    public MarketPlaceListingsEntity toEntity(){
        return MarketPlaceListingsEntity.builder()
                .sellerId(this.sellerId)
                .cardId(this.cardId)
                .price(this.price)
                .contactInfo(this.contactInfo)
                .location(this.location)
                .build();
    }
}
