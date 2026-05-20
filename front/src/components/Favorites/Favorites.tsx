import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Favorites.module.css';
import api from '../../api/axios'; // 설정하신 axios 인스턴스

// 백엔드 MarketPlaceListingsDTO 구조와 일치하는 인터페이스
interface FavoriteItem {
  listingId: number;
  cardNameKo: string;
  cardNumber: string;
  price: number;
  officialImageUrl: string;
  imageStrings: string[];
  nickname: string;
  location: string;
}

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:8080/pokemon/";

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = sessionStorage.getItem('accessToken');
      
      if (!token) {
        console.warn("로그인 토큰이 없습니다.");
        return;
      }

      try {
        // 백엔드 컨트롤러의 @GetMapping("favoritelist") 호출
        const response = await api.get('/api/market/favoritelist');
        
        setFavorites(response.data);
      } catch (error) {
        console.error("즐겨찾기 목록 로드 실패:", error);
      } finally {
      }
    };

    fetchFavorites();
  }, []);


  return (
    <div className={styles['favorites-container']}>
      <header className={styles['favorites-header']}>
        <h2>관심 카드 리스트</h2>
      </header>

      <div className={styles["favorites-list"]}>
        {favorites.length > 0 ? (
          favorites.map(card => (
            <div key={card.listingId} className={styles["favorite-card"]} onClick={() => navigate(`/buysell/detail/${card.listingId}`)}>
              <div className={styles["card-image-container"]}>
                <img 
                  src={card.imageStrings && card.imageStrings.length > 0 
                    ? `${BASE_URL}${card.imageStrings[0]}` 
                    : `${BASE_URL}${card.officialImageUrl}`} 
                  alt={card.cardNameKo} 
                  className={styles["card-image"]} 
                />
              </div>
              
              <div className={styles["card-info"]}>
                <div className={styles["card-name"]}>{card.cardNameKo}</div>
                <div className={styles["card-number"]} style={{fontSize: '0.8rem', color: '#888'}}>
                  {card.cardNumber}
                </div>
                
                <div className={styles["price-details"]}>
                  <div className={`${styles["price-row"]} ${styles["sell-price"]}`}>
                    <span className={styles["price-label"]}>판매가</span>
                    <span className={styles["price-value"]}>
                      {card.price.toLocaleString()}원
                    </span>
                  </div>
                  
                  <div className={styles["seller-tag"]} style={{marginTop: '5px', fontSize: '0.9rem'}}>
                    <span>판매자: <strong>{card.nickname}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles["empty-message"]}>즐겨찾기한 카드가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Favorites;