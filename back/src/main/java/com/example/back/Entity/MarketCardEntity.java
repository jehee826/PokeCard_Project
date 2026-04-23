package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "market_card")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class MarketCardEntity {

    @Id
    @Column(name = "card_id")
    private Long cardId;

    @Column(name = "card_name_ko", length=100)
    private String cardName;

    @Column(name = "official_image_url", length = 2048)
    private String imageUrl;

    @Column(name = "price")
    private int price;
}
