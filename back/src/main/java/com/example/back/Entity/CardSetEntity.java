package com.example.back.Entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "card_sets")
@ToString
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class CardSetEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "set_id")
    private Integer setId;

    @Column(name = "set_code", nullable = false, unique = true, length = 20)
    private String setCode;

    @Column(name = "series_name", length = 50)
    private String seriesName;

    @Column(name = "set_name_ko", nullable = false, length = 100)
    private String setNameKo;

    @Column(name = "total_cards")
    private Integer totalCards;

    @Column(name = "release_date")
    private LocalDate releaseDate;

    @Column(name = "logo_url", length = 2048)
    private String logoUrl;
}