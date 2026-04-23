package com.example.back.DTO;

import com.example.back.Entity.MarketCardEntity;
import com.example.back.Entity.UserEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class MarketCardDto {
    private Long id;
    private String cardName;
    private String imageUrl;
    private int price;


    public static MarketCardDto toDto(MarketCardEntity entity){
        return new MarketCardDto(
                entity.getCardId(),
                entity.getCardName(),
                entity.getImageUrl(),
                entity.getPrice()
        );
    }

    public MarketCardEntity toEntity(){
        return MarketCardEntity.builder()
                .cardId(this.id)
                .cardName(this.cardName)
                .imageUrl(this.imageUrl)
                .price(this.price)
                .build();
    }
}
