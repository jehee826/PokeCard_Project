package com.example.back.Service.Market;

import com.example.back.DTO.CardsDTO;
import com.example.back.DTO.MarketPlaceFavoriteDTO;
import com.example.back.DTO.MarketPlaceListingsDTO;
import com.example.back.DTO.TradeHistoryDTO;
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


    private final CardsRepository cardsRepository;
    private final UsersRepository userRepository;
    private final UserCollectionsRepository userCollectionsRepository;
    private final MarketPlaceListingsRepository marketPlaceListingsRepository;
    private final MarketPlaceImageRepository marketPlaceImageRepository;
    private final MarketPlaceFavoriteRepository marketPlaceFavoriteRepository;
    private final TradeHistoryRepository tradeHistoryRepository;
    private final JwtTokenProvider jwtTokenProvider;

    /** token을 통한 유저 인증 */
    private UsersEntity getAuthenticatedUser(String token) {
        String loginId = jwtTokenProvider.getLoginIdFromToken(token);
        return userRepository.findByLoginId(loginId)
                .orElseThrow(() -> new RuntimeException("인증된 유저를 찾을 수 없습니다."));
    }

    /** 토큰이 있으면 유저 ID를, 없으면 null을 반환 (비로그인 조회 허용) */
    private Long getUserIdOrNull(String token) {
        if (token == null || token.isEmpty()) return null;
        try {
            return userRepository.findByLoginId(jwtTokenProvider.getLoginIdFromToken(token))
                    .map(UsersEntity::getId)
                    .orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    /** 판매글 ID로 이미지 경로 리스트 조회 */
    private List<String> getListingImages(Long listingId) {
        return marketPlaceImageRepository.findByListingId(listingId)
                .stream()
                .map(MarketPlaceImageEntity::getImagePath)
                .collect(Collectors.toList());
    }

    /** CardsEntity -> CardsDTO 변환 */
    private CardsDTO convertToCardsDTO(CardsEntity card) {
        return CardsDTO.builder()
                .cardId(card.getCardId())
                .cardNumber(card.getCardNumber())
                .cardNameKo(card.getCardNameKo())
                .attribute(card.getAttribute())
                .officialImageUrl(card.getOfficialImageUrl())
                .build();
    }

    /** 모든 판매글 가져오기 */
    public List<CardsDTO> getAllListings() {
        List<Long> cardId = marketPlaceListingsRepository.getDistinctCardId();

        if (cardId.isEmpty()) return List.of();

        return cardsRepository.findAllById(cardId).stream()
                .map(this::convertToCardsDTO)
                .collect(Collectors.toList());
    }

    /** 받은 카드 id의 해당하는 판매글만 가져오기 */
    public List<MarketPlaceListingsDTO> getSellerListings(Long cardId, String token) {
        Long currentUserId = getUserIdOrNull(token);
        List<MarketPlaceListingsEntity> marketEntities = marketPlaceListingsRepository.findByCardId(cardId);
        if (marketEntities.isEmpty()) return List.of();

        CardsEntity card = cardsRepository.findById(cardId).orElse(null);

        return marketEntities.stream().map(market -> {
            String nickname = userRepository.findById(market.getSellerId())
                    .map(UsersEntity::getNickname)
                    .orElse("알 수 없음");

            MarketPlaceListingsDTO dto = MarketPlaceListingsDTO.toDto(market, card);
            dto.setNickname(nickname);
            dto.setOwner(Objects.equals(market.getSellerId(), currentUserId));
            dto.setImageStrings(getListingImages(market.getListingId()));
            return dto;
        }).collect(Collectors.toList());
    }

    /** 받은 listId로 한개의 판매글 정보만 가져오기 (이미지 리스트 포함) */
    public MarketPlaceListingsDTO getDetailList(Long listId, String token) {
        Long currentUserId = getUserIdOrNull(token);
        MarketPlaceListingsEntity listEntity = marketPlaceListingsRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("해당 판매글이 존재하지 않습니다."));

        CardsEntity cardEntity = cardsRepository.findById(listEntity.getCardId()).orElse(null);

        MarketPlaceListingsDTO dto = MarketPlaceListingsDTO.toDto(listEntity, cardEntity);
        dto.setImageStrings(getListingImages(listId)); // DTO에 세팅
        dto.setOwner(dto.getSellerId().equals(currentUserId));

        return dto;
    }

    /** 토큰을통해 알아낸 사용자의 보유 카드리스트를 가져옴 */
    public List<CardsDTO> getMyCardListings(String token){
        UsersEntity user = getAuthenticatedUser(token);
        List<CardsEntity> results = userCollectionsRepository.findMyCardsByLoginId(user.getLoginId());

        //JPQL사용한 메소드
        return results.stream()
                .map(this::convertToCardsDTO).collect(Collectors.toList());
    }

    /** 판매글 저장 (파일 시스템 저장 및 DB 경로 기록) */
    @Transactional // DB 작업과 파일 저장이 한 묶음으로 처리되도록 추가
    public void saveListing(MarketPlaceListingsDTO register, String token){
        UsersEntity user = getAuthenticatedUser(token);

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
        UsersEntity user = getAuthenticatedUser(token);

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
        UsersEntity user = getAuthenticatedUser(token);

        List<MarketPlaceFavoriteEntity> favoriteEntities = marketPlaceFavoriteRepository.findByUserId(user.getId());

        if (favoriteEntities.isEmpty()) {
            return List.of();
        }
        return favoriteEntities.stream()
                .map(fav -> {
                    try {
                        //위에 이미 만들어진 getDetailList메소드를 통해 코드 간결화(메소드 재사용)
                        return this.getDetailList(fav.getListingId(), token);
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
        UsersEntity user = getAuthenticatedUser(token);

        // 여기서 existsBy... 를 사용하여 가볍게 존재 여부만 체크!
        return marketPlaceFavoriteRepository.existsByUserIdAndListingId(user.getId(), listingId);
    }

    @Transactional
    public void registerPayment(Long sellerId, Long cardId, int finalPrice, String token){
        UsersEntity user = getAuthenticatedUser(token);

        if (user.getId().equals(sellerId)) {
            throw new RuntimeException("본인의 상품은 구매할 수 없습니다.");
        }

        TradeHistoryEntity tradeHistory = TradeHistoryEntity.builder()
                .buyerId(user.getId())
                .sellerId(sellerId)
                .cardId(cardId)
                .finalPrice(finalPrice)
                .build();

        tradeHistoryRepository.save(tradeHistory);
    }

    /** 판매글의 상태 변경 */
    @Transactional
    public void listStatus(Long listId, String status) {
        MarketPlaceListingsEntity listEntity = marketPlaceListingsRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("판매글을 찾을 수 없습니다."));
        listEntity.setStatus(MarketPlaceListingsEntity.ListingStatus.valueOf(status));
    }

    /** 내가 구매 OR 판매한 내역을 전부 가져옴 */
    @Transactional(readOnly = true)
    public List<TradeHistoryDTO> getMyTradeHistory(String token) {
        UsersEntity user = getAuthenticatedUser(token);

        // 내가 구매자이거나 판매자인 내역을 모두 가져옴
        List<TradeHistoryEntity> entities = tradeHistoryRepository
                .findByBuyerIdOrSellerIdOrderByTradeDateDesc(user.getId(), user.getId());


        return entities.stream().map(entity -> {
            // 해당 거래에 사용된 카드 상세 정보 조회
            CardsEntity card = cardsRepository.findById(entity.getCardId()).orElse(null);

            // toDto를 쓰지 않고 여기서 직접 모든 필드를 매핑하여 빌드
            return TradeHistoryDTO.builder()
                    .historyId(entity.getHistoryId())
                    .buyerId(entity.getBuyerId())
                    .sellerId(entity.getSellerId())
                    .buyer(entity.getBuyerId().equals(user.getId()))
                    .cardId(entity.getCardId())
                    .finalPrice(entity.getFinalPrice())
                    .tradeDate(entity.getTradeDate())
                    // 카드 정보 합치기 (카드 정보가 없을 경우를 대비해 null 체크 처리)
                    .cardNumber(card != null ? card.getCardNumber() : "N/A")
                    .cardNameKo(card != null ? card.getCardNameKo() : "삭제된 카드 정보")
                    .rarityCode(card != null ? card.getRarityCode() : "-")
                    .attribute(card != null ? card.getAttribute() : "-")
                    .officialImageUrl(card != null ? card.getOfficialImageUrl() : "")
                    .build();
        }).collect(Collectors.toList());
    }

}