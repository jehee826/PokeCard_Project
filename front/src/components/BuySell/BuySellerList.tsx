import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import './BuySell.css';

// --- 하위 컴포넌트: 개별 판매글 아이템 ---
const MarketItemCard = ({ item, navigate, BASE_URL }: any) => {
  const [isLiked, setIsLiked] = useState(false);

  // 1. 컴포넌트 로드 시 즐겨찾기 상태 확인
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) return;

      try {
        const response = await api.get('/api/market/is-favorite', {
          params: { listingId: item.listingId }
        });
        setIsLiked(response.data); // true 또는 false
      } catch (error) {
        console.error("즐찾 상태 확인 실패", error);
      }
    };
    checkFavoriteStatus();
  }, [item.listingId]);

  // 2. 즐겨찾기 토글 함수
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
      
      // 백엔드 메시지에 따라 상태 반전 (토글)
      if (response.data.includes("등록")) setIsLiked(true);
      else if (response.data.includes("취소")) setIsLiked(false);
      
      alert(response.data);
    } catch (error) {
      console.error("즐겨찾기 처리 실패", error);
    }
  };

  return (
    <div className="item-info">
      {item.imageStrings && item.imageStrings.length > 0 ? (
        <div
          className="item-image"
          style={{ backgroundImage: `url(${BASE_URL}${item.imageStrings[0]})` }}
        />
      ) : (
        <div className="item-image">사진 없음</div>
      )}
      <h3 onClick={() => navigate(`/buysell/detail/${item.listingId}`)}>{item.nickname}</h3>
      <p style={{ color: 'red' }}>{item.price.toLocaleString()}원</p>
      
      {/* 상태에 따라 하트 모양 변경 */}
      <button 
        onClick={() => handleFavorite(item.listingId)} 
        style={{ cursor: 'pointer', fontSize: '1.2rem', border: 'none', background: 'none' }}
      >
        {isLiked ? '❤️' : '🤍'}
      </button>
    </div>
  );
};

// --- 메인 컴포넌트 ---
const BuySellerList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<any[]>([]);
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
        {/* 상단 카드 정보 요약 (첫 번째 아이템 기준) */}
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

        {/* 판매글 리스트 루프 */}
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