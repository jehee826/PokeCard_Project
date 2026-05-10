import React, { useState, useEffect } from "react";
import api from '../../api/axios'; 
import styles from './MyCards.module.css';

interface MyCard {
  cardId: number;
  cardNumber: string;
  cardNameKo: string;
  officialImageUrl: string; // DB에 저장된 파일명 (예: "001.png")
  attribute: string;
}

const MyCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [myCards, setMyCards] = useState<MyCard[]>([]);
  
  // 개별 카드의 마우스 효과 상태 관리
  const [hoverStates, setHoverStates] = useState<{[key: number]: {x: number, y: number, isHovering: boolean}}>({});

  // 지난번에 설정한 로컬 백엔드 이미지 경로
  const BASE_URL = "http://localhost:8080/pokemon/";
  const types = ["Grass", "Fire", "Water", "Bug", "Dragon", "Normal"];

  useEffect(() => {
    const fetchMyCards = async () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) return;
      try {
        const response = await api.get('/api/market/mycard', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setMyCards(response.data);
      } catch (error) {
        console.error("내 카드 로딩 실패:", error);
      }
    };
    fetchMyCards();
  }, []);

  // 마우스 이동 핸들러 (Card.tsx의 x, y 계산 로직)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardId: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    setHoverStates(prev => ({
      ...prev,
      [cardId]: {
        x: (offsetY - 150) / 6, 
        y: -(offsetX - 100) / 3,
        isHovering: true
      }
    }));
  };

  const handleMouseLeave = (cardId: number) => {
    setHoverStates(prev => ({
      ...prev,
      [cardId]: { x: 0, y: 0, isHovering: false }
    }));
  };

  const toggleType = (type: string) => {
    if (type === "All") { setSelectedTypes([]); return; }
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const filteredCards = myCards.filter(card => {
    const matchesSearch = card.cardNumber.includes(searchTerm) || card.cardNameKo.includes(searchTerm);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(card.attribute);
    return matchesSearch && matchesType;
  });

  return (
    <div className={styles['my-cards-container']}>
      <aside className={styles["sidebar"]}>
        <h2 className={styles["sidebar-title"]}>My Collection</h2>
        <div className={styles["search-section"]}>
          <h3>Search</h3>
          <div className={styles["search-bar"]}>
            <input 
              type="text" 
              placeholder="Card ID or Name" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className={styles["filter-section"]}>
          <h3>Filter by Type</h3>
          <div className={styles["filter-group"]}>
            <button className={selectedTypes.length === 0 ? styles.active : ""} onClick={() => toggleType("All")}>All Types</button>
            {types.map(type => (
              <button key={type} className={selectedTypes.includes(type) ? styles.active : ""} onClick={() => toggleType(type)}>{type}</button>
            ))}
          </div>
        </div>
      </aside>

      <main className={styles['cards-display']}>
        <div className={styles['cards-grid']}>
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => {
              const state = hoverStates[card.cardId] || { x: 0, y: 0, isHovering: false };
              
              return (
                <div key={card.cardId} className={styles.cardWrapper}>
                  <div 
                    className={styles.card}
                    onMouseMove={(e) => handleMouseMove(e, card.cardId)}
                    onMouseLeave={() => handleMouseLeave(card.cardId)}
                    style={{
                      transform: `rotateX(${state.x}deg) rotateY(${state.y}deg)`,
                      transition: state.isHovering ? 'transform 0.1s ease-out' : 'transform 0.5s ease-in-out',
                      // 핵심: BASE_URL + officialImageUrl 조합
                      backgroundImage: `url(${BASE_URL}${card.officialImageUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      width: '200px',
                      height: '280px',
                      borderRadius: '12px',
                      position: 'relative',
                      boxShadow: state.isHovering ? '0 15px 35px rgba(0,0,0,0.3)' : '0 5px 15px rgba(0,0,0,0.1)',
                      cursor: 'pointer'
                    }}
                  >
                    {/* 카드 반짝임 효과(Overlay) */}
                    <div 
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: `radial-gradient(circle at ${50 - state.y * 2}% ${50 + state.x * 2}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 60%)`,
                        opacity: state.isHovering ? 1 : 0,
                        borderRadius: '12px',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                  <div className={styles.cardInfo} style={{ marginTop: '12px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{card.cardNameKo}</div>
                    <div style={{ color: '#888', fontSize: '12px' }}>{card.cardNumber}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className={styles['no-results']}>
              <p>보유한 카드가 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyCards;