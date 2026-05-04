package com.example.back.Service.Market;

import com.example.back.DTO.CardsDTO;
import com.example.back.DTO.MarketPlaceListingsDTO;
import com.example.back.DTO.UserCollectionsDTO;
import com.example.back.Entity.CardsEntity;
import com.example.back.Entity.MarketPlaceListingsEntity;
import com.example.back.Entity.UsersEntity;
import com.example.back.Repository.CardsRepository;
import com.example.back.Repository.MarketPlaceListingsRepository;
import com.example.back.Repository.UserCollectionsRepository;
import com.example.back.Repository.UsersRepository;
import com.example.back.Security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketPlaceListingsRepository marketPlaceListingsRepository;
    private final CardsRepository cardsRepository;
    private final UserCollectionsRepository userCollectionsRepository;
    private final UsersRepository userRepository; // 추가 필요
    private final JwtTokenProvider jwtTokenProvider; // 주입 받아 사용

    /** 모든 판매글 가져오기 */
    public List<MarketPlaceListingsDTO> getAllListings() {

        List<MarketPlaceListingsEntity> marketEntities = marketPlaceListingsRepository.findAll();

        //판매글정보 + 카드정보를 하나로 만들기
        return marketEntities.stream().map(market -> {
            //판매글 정보에 있는 card_id를 통해 cards테이블에서 같은 card_id를 가진 행을 찾음
            CardsEntity card = cardsRepository.findById(market.getCardId()).orElse(null);

            //DTO 생성(카드 정보가 있으면 넣고, 없으면 기본값 처리)
            return MarketPlaceListingsDTO.builder()
                    .listingId(market.getListingId())
                    .sellerId(market.getSellerId())
                    .cardId(market.getCardId())
                    .price(market.getPrice())
                    .contactInfo(market.getContactInfo())
                    .location(market.getLocation())
                    // 조인된 카드 정보 추가
                    .cardNameKo(card != null ? card.getCardNameKo() : "정보 없음")
                    .cardNumber(card != null ? card.getCardNumber() : "-")
                    .attribute(card != null ? card.getAttribute() : "-")
                    .officialImageUrl(card != null ? card.getOfficialImageUrl() : "-")
                    .build();
        }).collect(Collectors.toList());
    }

    /** 받은 listId로 한개의 판매글 정보만 가져오기 */
    public MarketPlaceListingsDTO getDetailList(Long listId) {
        MarketPlaceListingsEntity listEntity = marketPlaceListingsRepository.findById(listId).orElseThrow(() -> new RuntimeException("해당 판매글이 존재하지 않습니다."));

        CardsEntity cardEntity = cardsRepository.findById(listEntity.getCardId()).orElse(null);


        return MarketPlaceListingsDTO.toDto(listEntity, cardEntity);
    }

    public List<CardsDTO> getMyCardListings(String token){
        //loginId 뽑아오기
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);

        List<Object[]> results = userCollectionsRepository.findMyCardsByLoginId(loginId);

        return results.stream().map(result ->
                CardsDTO.builder()
                        .cardId(((Number) result[0]).longValue())
                        .cardNumber((String) result[1])
                        .cardNameKo((String) result[2])
                        .attribute((String) result[3])
                        .officialImageUrl((String) result[4])
                        .build()
        ).collect(Collectors.toList());
    }

    public void saveListing(MarketPlaceListingsDTO register, String token){
        //현재 로그인한 유저의 loginId 뽑아오기
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);
        UsersEntity user = userRepository.findByLoginId(loginId).orElseThrow(() -> new RuntimeException("해당 아이디를 가진 유저가 없습니다."));

        Long userId = user.getId();

        MarketPlaceListingsEntity newListing = MarketPlaceListingsEntity.builder()
                .sellerId(userId)                 // 토큰에서 찾은 진짜 PK값
                .cardId(register.getCardId())      // 프론트에서 보낸 카드 ID
                .price(register.getPrice())
                .contactInfo(register.getContactInfo())
                .location(register.getLocation())
                .build();

        marketPlaceListingsRepository.save(newListing);
    }
}