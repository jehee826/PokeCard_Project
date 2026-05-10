import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios'; //통신기능
import './BuySell.css';

interface MarketCard {
  listingId: number;
  sellerId: number;
  nickname: string;
  cardId: number;
  price: number;
  contactInfo: string;
  location: string;
  cardNameKo: string;
  cardNumber: string;
  attribute: string;
  officialImageUrl: string;
  imageStrings: string[];

}

const BuySellList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState<MarketCard[]>([]);

  const BASE_URL = "http://localhost:8080/pokemon/";

  // 페이지 로드 시 DB에서 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await api.get('/api/market/sellerlist', {
          params: { cardId: id }
        });
        setItems(response.data);
        console.log(response.data.imageList);
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      }
    };
    fetchCards();
  }, []);

  const handleFavorite = async (listingId: number) => {
    const token = sessionStorage.getItem('accessToken');
    if (!token) return;

    try {
      const response = await api.get('/api/market/favorite', {
        params: { listingId: listingId },
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert(response.data.message || "처리가 완료되었습니다.");
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  }


  return (
    <div className="buysell-container">
      <button onClick={() => navigate('/buysell')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666' }}>← 돌아가기</button>
      <div className="item-grid">
        {items.length > 0 && (
          <div className="item-card">
            <div
              className="item-image"
              // DB에서 받아온 imageUrl을 그대로 배경으로 사용
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
            <div key={item.listingId} className="item-info" >
              {item.imageStrings && item.imageStrings.length > 0 ? ( //사용자가 등록한 사진이 있을경우 띄우고 없으면 없다고 띄움
                <div
                  className="item-image"
                  // DB에서 받아온 imageUrl을 그대로 배경으로 사용
                  style={{ backgroundImage: `url(${BASE_URL}${item.imageStrings[0]})` }} //첫번째 이미지만 보여줌(대표이미지)
                />
              ) : (
                <div
                  className="item-image"
                >사진 없음</div>
              )}
              <h3 onClick={() => navigate(`/buysell/detail/${item.listingId}`)}>{item.nickname}</h3>
              <p style={{ color: 'red' }} >{item.price}</p>
              <button onClick={() => handleFavorite(item.listingId)} > 즐겨찾기 </button>
            </div>
          ))
        ) : (
          <div className="no-results">
            <p>No cards found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuySellList;