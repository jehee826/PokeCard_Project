package com.example.back.Controller;


import com.example.back.DTO.CardsDTO;
import com.example.back.Entity.CardsEntity;
import com.example.back.Repository.CardsRepository;
import com.example.back.Repository.UserCollectionsRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/main")
public class MainController {

    private CardsRepository cardsRepository;
    private UserCollectionsRepository userCollectionsRepository;

    public MainController(CardsRepository cardsRepository, UserCollectionsRepository userCollectionsRepository) {
        this.cardsRepository = cardsRepository;
        this.userCollectionsRepository = userCollectionsRepository;
    }

    @PostMapping("/ai")
    public ResponseEntity<?> recognizeCard(
            @RequestBody CardsDTO request,
            @AuthenticationPrincipal UserDetails loggedInUser
    ) {
        // 1. 먼저 카드를 찾습니다.
        Optional<CardsEntity> cardOpt = cardsRepository.findByCardNumber(request.getCardNumber());

        // 2. 카드가 없으면 바로 404 에러 반환
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("존재하지 않는 카드입니다.");
        }

        CardsEntity card = cardOpt.get();
        String officialImageUrl = card.getOfficialImageUrl();

        // 3. 로그인 여부 확인
        if (loggedInUser == null) {
            CardsDTO response = new CardsDTO(officialImageUrl, "카드 인식 성공 (로그인 후 수집 내역을 확인하세요)");
            return ResponseEntity.ok(response);
        }

        // 4. 로그인이 되어있는 경우: 도감 수집 여부 확인
        // (login_id를 통해 유저를 찾는 로직이 필요할 수 있으므로, 프로젝트 상황에 맞게 userId를 가져오세요)
        Long userId = Long.parseLong(loggedInUser.getUsername());
        boolean isAlreadyCollected = userCollectionsRepository.existsByUserIdAndCardId(userId, card.getCardId());

        // 5. 최종 결과 응답
        String msg = isAlreadyCollected ? "이미 도감에 등록된 카드입니다." : "새로운 카드 인식 성공! 도감에 추가해보세요.";
        return ResponseEntity.ok(new CardsDTO(officialImageUrl, msg));
    }}