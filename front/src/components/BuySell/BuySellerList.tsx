import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import './BuySell.css';

interface MarketPlaceListingsDTO {
  listingId: number;
  sellerId: number;
  cardId: number;
  price: number;
  contactInfo: string;
  location: string;
  cardNameKo: string;
  cardNumber: string;
  attribute: string;
  officialImageUrl: string;
  nickname: string;
  owner: boolean;
  imageStrings: string[];
}

interface MarketItemCardProps {
  item: MarketPlaceListingsDTO;
  navigate: ReturnType<typeof useNavigate>;
  BASE_URL: string;
}

const MarketItemCard = ({ item, navigate, BASE_URL }: MarketItemCardProps) => {
  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) return;
      try {
        const response = await api.get<boolean>('/api/market/is-favorite', {
          params: { listingId: item.listingId }
        });
        setIsLiked(response.data);
      } catch (error) {
        console.error("즐찾 상태 확인 실패", error);
      }
    };
    checkFavoriteStatus();
  }, [item.listingId]);

  const handleFavorite = async (listingId: number) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await api.get('/api/market/favorite', {
        params: { listingId: listingId }
      });
      if (response.data.includes("등록")) setIsLiked(true);
      else if (response.data.includes("취소")) setIsLiked(false);
      alert(response.data);
    } catch (error) {
      console.error("즐겨찾기 처리 실패", error);
    }
  };

  return (
    <div className="item-card">
      {item.imageStrings && item.imageStrings.length > 0 ? (
        <div
          onClick={() => navigate(`/buysell/detail/${item.listingId}`)}
          className="item-image"
          style={{ backgroundImage: `url("${BASE_URL}${encodeURI(item.imageStrings[0])}")`, cursor: 'pointer' }}
        />
      ) : (
        <div className="item-image" style={{ backgroundColor: '#f1f5f9', color: '#94a3b8', fontSize: '0.8rem' }}>사진 없음</div>
      )}

      <div className="item-info">
        <h3 onClick={() => navigate(`/buysell/detail/${item.listingId}`)} style={{ cursor: 'pointer' }}>
          {item.nickname}
        </h3>
        <div className="item-price">{item.price.toLocaleString()}원</div>

        <button
          onClick={() => handleFavorite(item.listingId)}
          style={{ cursor: 'pointer', fontSize: '1.2rem', border: 'none', background: 'none', marginTop: '10px', padding: 0, width: 'fit-content' }}
        >
          {isLiked ? '❤️' : '🤍'}
        </button>
      </div>
    </div>
  );
};

// --- 메인 컴포넌트 ---
const BuySellerList = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketPlaceListingsDTO[]>([]);
  const BASE_URL = "http://localhost:8080/pokemon/";

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await api.get('/api/market/sellerlist', {
          params: { cardId: id }
        });
        setItems(response.data);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchCards();
  }, [id]);

  return (
    <div className="buysell-container">
      <button onClick={() => navigate('/buysell')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666' }}>← 돌아가기</button>

      <div className="item-grid">
        {items.length > 0 && (
          <div className="item-card main-summary">
            <div
              className="item-image"
              style={{ backgroundImage: `url(${BASE_URL}${items[0].officialImageUrl})` }}
            />
            <div className="item-info">
              <h3>{items[0].cardNameKo}</h3>
              <p>{items[0].cardNumber}</p>
            </div>
          </div>
        )}

        {items.length > 0 ? (
          items.map(item => (
            <MarketItemCard
              key={item.listingId}
              item={item}
              navigate={navigate}
              BASE_URL={BASE_URL}
            />
          ))
        ) : (
          <div className="no-results">
            <p>등록된 판매글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuySellerList;