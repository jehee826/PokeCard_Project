package com.example.back.DTO;

import com.example.back.Entity.CardsEntity;
import com.example.back.Entity.MarketPlaceListingsEntity;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@ToString//로그찍기용
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MarketPlaceListingsDTO {

    private Long listingId;
    private Long sellerId;
    private Long cardId;
    private Integer price;
    private String contactInfo;
    private String location;
    private String status;
    //card_id를 통해 조인한 cards테이블의 정보를 잠깐 담을 변수들
    private String cardNameKo;
    private String cardNumber;
    private String attribute;
    private String officialImageUrl;
    //이미지 담을 변수
    private List<MultipartFile> images;
    private List<String> imageStrings;
    //유저 정보 변수
    private String loginId;
    private String nickname;
    //내글 확인 변수
    private boolean owner;
    //현재 내역에 있는지 확인
    private boolean inHistory;


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
