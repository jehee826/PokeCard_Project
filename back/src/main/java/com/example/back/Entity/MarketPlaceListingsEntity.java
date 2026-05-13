package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.DynamicInsert;

import java.time.LocalDateTime;

@Entity
@Table(name = "marketplace_listings")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
@DynamicInsert //null인 필드는 INSERT 쿼리에서 제외 -> DB의 DEFAULT '판매중'이 작동함
public class MarketPlaceListingsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listing_id")
    private Long listingId;

    @Column(name = "seller_id", nullable = false)
    private Long sellerId; // 필요에 따라 User 엔티티와 @ManyToOne 관계로 변경 가능

    @Column(name = "collection_id")
    private Long collectionId;

    @Column(name = "card_id")
    private Long cardId;

    @Column(name = "price", nullable = false)
    private Integer price;

    @Column(name = "contact_info", length = 100, nullable = false)
    private String contactInfo;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING) // ENUM을 문자열로 저장
    @Column(name = "status", columnDefinition = "ENUM('판매중', '예약중', '판매완료', '취소됨')")
    private ListingStatus status;

    @Column(name = "created_at", updatable = false, insertable = false)
    private LocalDateTime createdAt;

    @Column(name = "sold_at")
    private LocalDateTime soldAt;

    public enum ListingStatus { //status에서 쓸 enum리스트
        판매중, 예약중, 판매완료, 취소됨
    }
}

