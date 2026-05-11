package com.example.back.Service.Market;

import com.example.back.DTO.CardsDTO;
import com.example.back.DTO.MarketPlaceFavoriteDTO;
import com.example.back.DTO.MarketPlaceListingsDTO;
import com.example.back.Entity.*;
import com.example.back.Repository.*;
import com.example.back.Security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MarketService {

    private final MarketPlaceListingsRepository marketPlaceListingsRepository;
    private final MarketPlaceImageRepository marketPlaceImageRepository;
    private final CardsRepository cardsRepository;
    private final UserCollectionsRepository userCollectionsRepository;
    private final UsersRepository userRepository;
    private final MarketPlaceFavoriteRepository marketPlaceFavoriteRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /** 모든 판매글 가져오기 */
    public List<CardsDTO> getAllListings() {
        List<Long> cardId = marketPlaceListingsRepository.getDistinctCardId();

        if (cardId.isEmpty()) {
            return List.of();
        }

        List<CardsEntity> cards = cardsRepository.findAllById(cardId);

        return cards.stream().map(card ->
                CardsDTO.builder()
                        .cardId(card.getCardId())
                        .cardNumber(card.getCardNumber())
                        .cardNameKo(card.getCardNameKo())
                        .attribute(card.getAttribute())
                        .officialImageUrl(card.getOfficialImageUrl())
                        .build()
        ).collect(Collectors.toList());
    }

    /** 받은 카드 id의 해당하는 판매글만 가져오기 */
    public List<MarketPlaceListingsDTO> getSellerListings(Long cardId) {
        List<MarketPlaceListingsEntity> marketEntities = marketPlaceListingsRepository.findByCardId(cardId);

        if (marketEntities.isEmpty()) {
            return List.of();
        }

        CardsEntity card = cardsRepository.findById(cardId).orElse(null);
        String cardName = (card != null) ? card.getCardNameKo() : "정보 없음";
        String cardNum = (card != null) ? card.getCardNumber() : "-";
        String attribute = (card != null) ? card.getAttribute() : "-";
        String officialImg = (card != null) ? card.getOfficialImageUrl() : "-";



        return marketEntities.stream().map(market -> {
            System.out.println("판매글 ID: " + market.getListingId());
            // 추가: 해당 게시글의 이미지 파일명 리스트 조회
            List<String> imageNames = marketPlaceImageRepository.findByListingId(market.getListingId())
                    .stream()
                    .map(MarketPlaceImageEntity::getImagePath)
                    .collect(Collectors.toList());
            String nickname = userRepository.findById(market.getSellerId())
                    .map(UsersEntity::getNickname)
                    .orElse("알 수 없음");

            return MarketPlaceListingsDTO.builder()
                    .listingId(market.getListingId())
                    .sellerId(market.getSellerId())
                    .nickname(nickname)
                    .cardId(market.getCardId())
                    .price(market.getPrice())
                    .contactInfo(market.getContactInfo())
                    .location(market.getLocation())
                    .cardNameKo(cardName)
                    .cardNumber(cardNum)
                    .attribute(attribute)
                    .officialImageUrl(officialImg)
                    .imageStrings(imageNames)

                    .build();
        }).collect(Collectors.toList());
    }



    /** 받은 listId로 한개의 판매글 정보만 가져오기 (이미지 리스트 포함) */
    public MarketPlaceListingsDTO getDetailList(Long listId) {
        MarketPlaceListingsEntity listEntity = marketPlaceListingsRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("해당 판매글이 존재하지 않습니다."));

        CardsEntity cardEntity = cardsRepository.findById(listEntity.getCardId()).orElse(null);

        // 추가: 이미지 파일명 리스트 조회
        List<String> imageNames = marketPlaceImageRepository.findByListingId(listId)
                .stream()
                .map(MarketPlaceImageEntity::getImagePath)
                .collect(Collectors.toList());

        MarketPlaceListingsDTO dto = MarketPlaceListingsDTO.toDto(listEntity, cardEntity);
        dto.setImageStrings(imageNames); // DTO에 세팅

        return dto;
    }

    public List<CardsDTO> getMyCardListings(String token){
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

    /** 판매글 저장 (파일 시스템 저장 및 DB 경로 기록) */
    @Transactional // DB 작업과 파일 저장이 한 묶음으로 처리되도록 추가
    public void saveListing(MarketPlaceListingsDTO register, String token){
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);
        UsersEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("해당 아이디를 가진 유저가 없습니다."));

        MarketPlaceListingsEntity newListing = MarketPlaceListingsEntity.builder()
                .sellerId(user.getId())
                .cardId(register.getCardId())
                .price(register.getPrice())
                .contactInfo(register.getContactInfo())
                .location(register.getLocation())
                .build();

        MarketPlaceListingsEntity savedListing = marketPlaceListingsRepository.save(newListing);

        if (register.getImages() != null && !register.getImages().isEmpty()) {
            String uploadDir = "C:/pokemon/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile file : register.getImages()) {
                String originalFileName = file.getOriginalFilename();
                String savedFileName = "upload/" + UUID.randomUUID().toString() + "_" + originalFileName;

                try {
                    file.transferTo(new File(uploadDir + savedFileName));

                    MarketPlaceImageEntity imageEntity = MarketPlaceImageEntity.builder()
                            .listingId(savedListing.getListingId())
                            .imagePath(savedFileName)
                            .build();

                    marketPlaceImageRepository.save(imageEntity);

                } catch (IOException e) {
                    throw new RuntimeException("파일 저장 중 오류가 발생했습니다.", e);
                }
            }
        }
    }

    @Transactional // DB 작업과 파일 저장이 한 묶음으로 처리되도록 추가
    public String toggleFavorite(Long listingId, String token) {
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);
        UsersEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        // 1. 이미 즐겨찾기가 되어 있는지 확인
        Optional<MarketPlaceFavoriteEntity> existingFavorite =
                marketPlaceFavoriteRepository.findByUserIdAndListingId(user.getId(), listingId);

        if (existingFavorite.isPresent()) {
            // 2. 이미 있다면? 삭제 (취소)
            marketPlaceFavoriteRepository.delete(existingFavorite.get());
            return "즐겨찾기가 취소되었습니다.";
        } else {
            // 3. 없다면? 등록
            MarketPlaceFavoriteEntity favoriteEntity = MarketPlaceFavoriteEntity.builder()
                    .userId(user.getId())
                    .listingId(listingId)
                    .build();
            marketPlaceFavoriteRepository.save(favoriteEntity);
            return "즐겨찾기에 등록되었습니다.";
        }
    }

    /** 내 즐겨찾기 목록 상세 조회 */
    @Transactional(readOnly = true)
    public List<MarketPlaceListingsDTO> getMyFavoriteList(String token) {
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);

        UsersEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("해당 유저를 찾을 수 없습니다."));

        List<MarketPlaceFavoriteEntity> favoriteEntities = marketPlaceFavoriteRepository.findByUserId(user.getId());

        if (favoriteEntities.isEmpty()) {
            return List.of();
        }
        return favoriteEntities.stream()
                .map(fav -> {
                    try {
                        //위에 이미 만들어진 getDetailList메소드를 통해 코드 간결화(메소드 재사용)
                        return this.getDetailList(fav.getListingId());
                    } catch (Exception e) {
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /** 특정 판매글의 즐겨찾기 여부 확인 */
    @Transactional(readOnly = true)
    public boolean isFavorite(Long listingId, String token) {
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);
        UsersEntity user = userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("유저를 찾을 수 없습니다."));

        // 여기서 existsBy... 를 사용하여 가볍게 존재 여부만 체크!
        return marketPlaceFavoriteRepository.existsByUserIdAndListingId(user.getId(), listingId);
    }

}