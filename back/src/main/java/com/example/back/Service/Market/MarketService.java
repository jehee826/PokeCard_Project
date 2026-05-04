package com.example.back.Service.Market;

import com.example.back.DTO.CardsDTO;
import com.example.back.DTO.MarketPlaceListingsDTO;
import com.example.back.Entity.CardsEntity;
import com.example.back.Entity.MarketPlaceImageEntity;
import com.example.back.Entity.MarketPlaceListingsEntity;
import com.example.back.Entity.UsersEntity;
import com.example.back.Repository.*;
import com.example.back.Security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.List;
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
    private final JwtTokenProvider jwtTokenProvider;

    /** 모든 판매글 가져오기 (이미지 리스트 포함) */
    public List<MarketPlaceListingsDTO> getAllListings() {
        List<MarketPlaceListingsEntity> marketEntities = marketPlaceListingsRepository.findAll();

        return marketEntities.stream().map(market -> {
            CardsEntity card = cardsRepository.findById(market.getCardId()).orElse(null);

            // 추가: 해당 게시글의 이미지 파일명 리스트 조회
            List<String> imageNames = marketPlaceImageRepository.findByListingId(market.getListingId())
                    .stream()
                    .map(MarketPlaceImageEntity::getImagePath)
                    .collect(Collectors.toList());

            return MarketPlaceListingsDTO.builder()
                    .listingId(market.getListingId())
                    .sellerId(market.getSellerId())
                    .cardId(market.getCardId())
                    .price(market.getPrice())
                    .contactInfo(market.getContactInfo())
                    .location(market.getLocation())
                    .cardNameKo(card != null ? card.getCardNameKo() : "정보 없음")
                    .cardNumber(card != null ? card.getCardNumber() : "-")
                    .attribute(card != null ? card.getAttribute() : "-")
                    .officialImageUrl(card != null ? card.getOfficialImageUrl() : "-")
                    .imageStrings(imageNames) // DTO에 파일명 리스트 전달
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
            String uploadDir = "C:/upload/pokemon/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            for (MultipartFile file : register.getImages()) {
                String originalFileName = file.getOriginalFilename();
                String savedFileName = UUID.randomUUID().toString() + "_" + originalFileName;

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
}