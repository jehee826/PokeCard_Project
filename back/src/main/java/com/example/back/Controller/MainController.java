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

    private final CardsRepository cardsRepository;
    private final UserCollectionsRepository userCollectionsRepository;
    private final com.example.back.Repository.UsersRepository userRepository;

    public MainController(CardsRepository cardsRepository, 
                          UserCollectionsRepository userCollectionsRepository,
                          com.example.back.Repository.UsersRepository userRepository) {
        this.cardsRepository = cardsRepository;
        this.userCollectionsRepository = userCollectionsRepository;
        this.userRepository = userRepository;
    }

    @PostMapping("/ai")
    public ResponseEntity<?> recognizeCard(
            @RequestBody CardsDTO request,
            @AuthenticationPrincipal UserDetails loggedInUser
    ) {
        log.info("인식된 OCR 텍스트: {}", request.getCardNumber());
        
        if (request.getCardNumber() == null || request.getCardNumber().isEmpty()) {
            return ResponseEntity.badRequest().body("인식된 텍스트가 없습니다.");
        }

        // 1. OCR 결과가 쉼표로 구분된 여러 텍스트일 수 있으므로 분리하여 검색 시도
        String[] parts = request.getCardNumber().split(",\\s*");
        Optional<CardsEntity> cardOpt = Optional.empty();
        
        for (String part : parts) {
            String cleanPart = part.trim();
            if (cleanPart.isEmpty()) continue;
            
            // 정확한 카드 번호 매칭 시도
            cardOpt = cardsRepository.findByCardNumber(cleanPart);
            if (cardOpt.isPresent()) break;
            
            // (추가 제안) 필요하다면 여기서 LIKE 검색이나 다른 로직을 추가할 수 있습니다.
        }

        // 2. 카드가 없으면 404 에러 반환
        if (cardOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new CardsDTO(null, "존재하지 않거나 인식할 수 없는 카드입니다."));
        }

        CardsEntity card = cardOpt.get();
        String officialImageUrl = card.getOfficialImageUrl();
        
        // 만약 이미지 URL이 상대 경로라면 /를 붙여서 정적 리소스로 접근 가능하게 함
        if (officialImageUrl != null && !officialImageUrl.startsWith("http") && !officialImageUrl.startsWith("/")) {
            officialImageUrl = "/" + officialImageUrl;
        }

        // 3. 로그인 여부 확인
        if (loggedInUser == null) {
            return ResponseEntity.ok(new CardsDTO(officialImageUrl, "카드 인식 성공! (로그인하시면 도감에 등록됩니다)"));
        }

        // 4. 로그인이 되어있는 경우: login_id를 통해 실제 유저 PK(userId)를 찾음
        String loginId = loggedInUser.getUsername();
        String finalImageUrl = officialImageUrl;
        return userRepository.findByLoginId(loginId)
                .map(user -> {
                    boolean isAlreadyCollected = userCollectionsRepository.existsByUserIdAndCardId(user.getId(), card.getCardId());
                    String msg = isAlreadyCollected ? "이미 도감에 등록된 카드입니다." : "새로운 카드 인식 성공! 도감에 추가해보세요.";
                    return ResponseEntity.ok(new CardsDTO(finalImageUrl, msg));
                })
                .orElseGet(() -> {
                    return ResponseEntity.ok(new CardsDTO(finalImageUrl, "카드 인식 성공 (유저 정보를 찾을 수 없습니다)"));
                });
    }
}