import React, { useState, useEffect } from "react";
import Card from "../Middle/M/Card.tsx";
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
  
  const types = ["Grass", "Fire", "Water", "Bug", "Dragon", "Normal"];

  useEffect(() => {
    const fetchMyCards = async () => {
      const token = sessionStorage.getItem('accessToken');
      if (!token) return;
      try {
        const response = await api.get('/api/market/mycard');
        setMyCards(response.data);
      } catch (error) {
        console.error("내 카드 로딩 실패:", error);
      }
    };
    fetchMyCards();
  }, []);

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
            filteredCards.map((card) => (
              <div key={card.cardId} className={styles.cardWrapper}>
                <Card officialImageUrl={card.officialImageUrl} />
                <div className={styles.cardInfo} style={{ marginTop: '12px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{card.cardNameKo}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>{card.cardNumber}</div>
                </div>
              </div>
            ))
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