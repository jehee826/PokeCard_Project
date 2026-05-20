package com.example.back.DTO;

import com.example.back.Entity.CardSetEntity;
import lombok.*;
import java.time.LocalDate;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CardSetDTO {
    private Integer setId;
    private String setCode;
    private String seriesName;
    private String setNameKo;
    private Integer totalCards;
    private LocalDate releaseDate;
    private String logoUrl;

    public static CardSetDTO toDto(CardSetEntity entity) {
        return CardSetDTO.builder()
                .setId(entity.getSetId())
                .setCode(entity.getSetCode())
                .seriesName(entity.getSeriesName())
                .setNameKo(entity.getSetNameKo())
                .totalCards(entity.getTotalCards())
                .releaseDate(entity.getReleaseDate())
                .logoUrl(entity.getLogoUrl())
                .build();
    }

    public CardSetEntity toEntity() {
        return CardSetEntity.builder()
                .setCode(this.setCode)
                .seriesName(this.seriesName)
                .setNameKo(this.setNameKo)
                .totalCards(this.totalCards)
                .releaseDate(this.releaseDate)
                .logoUrl(this.logoUrl)
                .build();
    }
}