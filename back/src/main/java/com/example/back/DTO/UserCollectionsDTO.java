package com.example.back.DTO;

import com.example.back.Entity.UserCollectionsEntity;
import lombok.*;
import java.time.LocalDateTime;

@ToString
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserCollectionsDTO {
    private Long collectionId;
    private Long userId;
    private Long cardId;
    private Integer quantity;
    private String conditionGrade;
    private String acquiredMethod;
    private LocalDateTime addedAt;

    public static UserCollectionsDTO toDto(UserCollectionsEntity entity) {
        return UserCollectionsDTO.builder()
                .collectionId(entity.getCollectionId())
                .userId(entity.getUserId())
                .cardId(entity.getCardId())
                .quantity(entity.getQuantity())
                .conditionGrade(entity.getConditionGrade())
                .acquiredMethod(entity.getAcquiredMethod())
                .addedAt(entity.getAddedAt())
                .build();
    }

    public UserCollectionsEntity toEntity() {
        return UserCollectionsEntity.builder()
                .userId(this.userId)
                .cardId(this.cardId)
                .quantity(this.quantity)
                .conditionGrade(this.conditionGrade)
                .acquiredMethod(this.acquiredMethod)
                .build();
    }
}