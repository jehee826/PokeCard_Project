package com.example.back.DTO;

import com.example.back.Entity.CardsEntity;
import lombok.*;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardsDTO {
    private Long cardId;
    private Integer setId;
    private String externalId;
    private String cardNumber;
    private String cardNameKo;
    private String rarityCode;
    private String attribute;
    private String officialImageUrl;

    public static CardsDTO toDto(CardsEntity entity) {
        return CardsDTO.builder()
                .cardId(entity.getCardId())
                .setId(entity.getSetId())
                .externalId(entity.getExternalId())
                .cardNumber(entity.getCardNumber())
                .cardNameKo(entity.getCardNameKo())
                .rarityCode(entity.getRarityCode())
                .attribute(entity.getAttribute())
                .officialImageUrl(entity.getOfficialImageUrl())
                .build();
    }

    public CardsEntity toEntity() {
        return CardsEntity.builder()
                .setId(this.setId)
                .externalId(this.externalId)
                .cardNumber(this.cardNumber)
                .cardNameKo(this.cardNameKo)
                .rarityCode(this.rarityCode)
                .attribute(this.attribute)
                .officialImageUrl(this.officialImageUrl)
                .build();
    }
}