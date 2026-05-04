package com.example.back.Controller;

import com.example.back.DTO.CardsDTO;
import com.example.back.DTO.MarketPlaceListingsDTO;
import com.example.back.DTO.UserCollectionsDTO;
import com.example.back.Service.Market.MarketService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j //로그찍기
@RestController
@RequestMapping("/api/market")
@RequiredArgsConstructor
public class MarketController {

    //서비스 주입
    private final MarketService marketService;

    /** 모든리스트를 가져옴 */
    @GetMapping("/list")
    public ResponseEntity<List<MarketPlaceListingsDTO>> getMarketCardList(){

        // 서비스호출 -> 모든 리스트 가져오기(cards테이블 조인까지)
        List<MarketPlaceListingsDTO> dtoList = marketService.getAllListings();

        //잘 넘어오나 확인용 로그
        //log.info("전송할 DTO 리스트 (카드정보 포함): {}", dtoList);

        return ResponseEntity.ok(dtoList);
    }

    /** listId를 받아 검색한뒤 해당하는 하나의 정보만 가져옴 */
    @GetMapping("/detail")
    public ResponseEntity<MarketPlaceListingsDTO> getMarketCard(@RequestParam Long listId){

        //서비스호출 -> 한개의 판매글만 가져오기
        MarketPlaceListingsDTO dto = marketService.getDetailList(listId);

        //잘 넘어오나 확인용 로그
        log.info("전송할 DTO 리스트 (카드정보 포함): {}", dto);

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/mycard")
    public ResponseEntity<?> getMyCardList(@RequestHeader("Authorization") String authHeader){

        //"Bearer " 문자열 제거 (토큰 값만 추출)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }
        String token = authHeader.substring(7);

        List<CardsDTO> myCard = marketService.getMyCardListings(token);
        return ResponseEntity.ok(myCard);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerCard(@ModelAttribute MarketPlaceListingsDTO register, @RequestHeader("Authorization") String authHeader){
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않은 토큰입니다.");
        }
        String token = authHeader.substring(7);

        marketService.saveListing(register, token);

        return ResponseEntity.ok("등록성공");
    }
}
