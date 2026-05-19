package com.example.back.Controller;

import com.example.back.DTO.CardsDTO;
import com.example.back.DTO.MarketPlaceFavoriteDTO;
import com.example.back.DTO.MarketPlaceListingsDTO;
import com.example.back.DTO.TradeHistoryDTO;
import com.example.back.Entity.MarketPlaceListingsEntity;
import com.example.back.Service.Market.MarketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j //로그찍기
@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {

    //서비스 주입
    private final MarketService marketService;

    /** 모든리스트 조회 */
    @GetMapping("/alllist")
    public ResponseEntity<List<CardsDTO>> getMarketCardList(){

        List<CardsDTO> dtoList = marketService.getAllListings();
        //로깅
        log.info("전송할 DTO 리스트 (모든 카드 리스트): {}", dtoList);

        return ResponseEntity.ok(dtoList);
    }

    /** 해당 카드의 판매글만 조회 */
    @GetMapping("/sellerlist")
    public ResponseEntity<List<MarketPlaceListingsDTO>> getMarketCardSellerList(@RequestParam Long cardId, @RequestHeader(value = "Authorization", required = false) String authHeader){

        //토큰이 있으면 추출, 없으면 null
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7) : null;

        List<MarketPlaceListingsDTO> dtoList = marketService.getSellerListings(cardId, token);

        //잘 넘어오나 확인용 로그
        log.info("전송할 DTO 리스트 (카드정보 포함): {}", dtoList);


        return ResponseEntity.ok(dtoList);
    }

    /** 받은 listId값의 정보 조회 */
    @GetMapping("/detail")
    public ResponseEntity<MarketPlaceListingsDTO> getMarketCard(@RequestParam Long listId, @RequestHeader(value = "Authorization", required = false) String authHeader){

        //토큰이 있으면 추출, 없으면 null
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7) : null;

        //서비스호출 -> 한개의 판매글만 가져오기
<<<<<<< HEAD
        MarketPlaceListingsDTO dto = marketService.getDetailList(listId, token);
=======
        MarketPlaceListingsDTO dto = marketService.getDetailList(listId);
//        String sellerId = marketService.getSellerLoginId(listId);
>>>>>>> develop

        //잘 넘어오나 확인용 로그
        log.info("전송할 DTO 리스트 (판매글 세부정보): {}", dto);

        return ResponseEntity.ok(dto);
    }

    /** 로그인한 사용자의 보유카드 조회 */
    @GetMapping("/mycard")
    public ResponseEntity<?> getMyCardList(@RequestHeader("Authorization") String authHeader){

        //"Bearer " 문자열 제거 (토큰 값만 추출)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }
        String token = authHeader.substring(7);

        List<CardsDTO> myCard = marketService.getMyCardListings(token);

        if (myCard == null || myCard.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("보유하신 카드가 없습니다.");
        }

        log.info("전송할 DTO 리스트(보유카드 리스트): {}", myCard);

        return ResponseEntity.ok(myCard);
    }

    /** 판매글 등록 */
    @PostMapping("/register")
    public ResponseEntity<?> registerList(@ModelAttribute MarketPlaceListingsDTO register, @RequestHeader("Authorization") String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }
        String token = authHeader.substring(7);

        marketService.saveListing(register, token);

        return ResponseEntity.ok("등록성공");
    }

    @PostMapping("edit")
    public ResponseEntity<?> editList(@RequestParam Long listingId, @ModelAttribute MarketPlaceListingsDTO editDTO){
        marketService.editList(listingId, editDTO);

        return ResponseEntity.ok("수정성공");
    }

    /** 즐찾 추가/제거 */
    @GetMapping("/favorite")
    public ResponseEntity<?> insertFavorite(@RequestParam Long listingId, @RequestHeader("Authorization") String authHeader){
        //"Bearer " 문자열 제거 (토큰 값만 추출)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }
        String token = authHeader.substring(7);

        String resultMessage = marketService.toggleFavorite(listingId, token);
        return ResponseEntity.ok(resultMessage);
    }

    /** 즐찾 리스트 조회 */
    @GetMapping("favoritelist")
    public ResponseEntity<?> getMyFavoriteList(@RequestHeader("Authorization") String authHeader){
        // 토큰 검증 및 Bearer 제거
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("토큰이 유효하지 않습니다.");
        }
        String token = authHeader.substring(7);

        // 서비스 호출
        List<MarketPlaceListingsDTO> favorites = marketService.getMyFavoriteList(token);

        return ResponseEntity.ok(favorites);
    }

    @GetMapping("/is-favorite")
    public ResponseEntity<Boolean> checkFavorite(@RequestParam Long listingId, @RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(false); // 토큰 없으면 당연히 찜 아님
        }
        String token = authHeader.substring(7);
        return ResponseEntity.ok(marketService.isFavorite(listingId, token));
    }

    @PostMapping("/payment")
    public ResponseEntity<?> processPayment(@RequestBody TradeHistoryDTO request,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.ok(false); // 토큰 없으면 당연히 찜 아님
        }
        String token = authHeader.substring(7);

        marketService.registerPayment(request.getSellerId(), request.getCardId(), request.getFinalPrice(), token);

        return ResponseEntity.ok().body("거래가 완료되었습니다.");
    }

    /** 판매완료 요청 */
    @PostMapping("/sellcomplete")
    public ResponseEntity<?> sellComplete(@RequestBody Map<String, String> data){
        Long listId = Long.parseLong(data.get("listId"));
        String status = data.get("status");

        marketService.listStatus(listId, status);

        return ResponseEntity.ok("상태변경 완료");
    }

    @GetMapping("/history")
    public ResponseEntity<List<TradeHistoryDTO>> getHistory(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        String token = authHeader.substring(7);

        List<TradeHistoryDTO> history = marketService.getMyTradeHistory(token);

        log.info("전송할 DTO 리스트(거래내역): {}", history);

        return ResponseEntity.ok(history);
    }
}
