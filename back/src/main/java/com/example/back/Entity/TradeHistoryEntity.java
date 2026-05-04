package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "trade_history")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class TradeHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private Long historyId;

    @Column(name = "buyer_id")
    private Long buyerId;

    @Column(name = "seller_id")
    private Long sellerId;

    @Column(name = "card_id", nullable = false)
    private Long cardId;

    @Column(name = "final_price", nullable = false)
    private Integer finalPrice;

    @Column(name = "trade_date", updatable = false)
    private LocalDateTime tradeDate;

    @PrePersist
    public void prePersist() {
        this.tradeDate = LocalDateTime.now();
    }
}