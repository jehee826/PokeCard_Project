package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cards")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CardsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "card_id")
    private Long cardId;

    @Column(name = "external_id", unique = true, length = 50)
    private String externalId;

    @Column(name = "card_number", nullable = false, length = 20)
    private String cardNumber;

    @Column(name = "card_name_ko", nullable = false, length = 100)
    private String cardNameKo;

    @Column(name = "rarity_code", length = 10)
    private String rarityCode;

    @Column(name = "attribute", length = 20)
    private String attribute;

    @Column(name = "official_image_url", length = 2048)
    private String officialImageUrl;
}