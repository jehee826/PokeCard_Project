package com.example.back.Controller;

import com.example.back.DTO.MarketCardDto;
import com.example.back.Entity.MarketCardEntity;
import com.example.back.Repository.MarketCardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketCardController {

    private final MarketCardRepository marketCardRepository;

    @GetMapping("/list")
    public ResponseEntity<List<MarketCardDto>> getMarketCardList(){
        List<MarketCardEntity> marketCards = marketCardRepository.findAll();

        // 3. 엔티티 리스트를 DTO 리스트로 변환 (toDto 활용)
        List<MarketCardDto> dtoList = marketCards.stream()
                .map(MarketCardDto::toDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtoList);

    }
}
