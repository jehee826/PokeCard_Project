import React, { useState } from "react";
import Card from "../Middle/M/Card.tsx";
import styles from './MyCards.module.css';

const MyCards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 카드 데이터베이스 (예시 데이터)
  const fullCardList = [
    { id: "001", type: "Grass" }, { id: "002", type: "Grass" }, { id: "003", type: "Grass" },
    { id: "004", type: "Fire" }, { id: "005", type: "Fire" }, { id: "006", type: "Fire" },
    { id: "007", type: "Water" }, { id: "008", type: "Water" }, { id: "009", type: "Water" },
    { id: "010", type: "Bug" }, { id: "011", type: "Bug" }, { id: "012", type: "Bug" },
  ];

  const types = ["Grass", "Fire", "Water", "Bug", "Dragon"];

  // 타입 토글 핸들러
  const toggleType = (type: string) => {
    if (type === "All") {
      setSelectedTypes([]);
      return;
    }
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // 검색 및 복수 필터링 로직
  const filteredCards = fullCardList.filter(card => {
    const matchesSearch = card.id.includes(searchTerm);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(card.type);
    return matchesSearch && matchesType;
  });

  return (
    <div className={styles['my-cards-container']}>
      {/* 왼쪽 사이드바: 검색 및 필터 */}
      <aside className={styles.sidebar}>
        <h2 className={styles['sidebar-title']}>My Collection</h2>
        
        <div className={styles['search-section']}>
          <h3>Search</h3>
          <div className={styles['search-bar']}>
            <input 
              type="text" 
              placeholder="Card ID (001~012)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles['filter-section']}>
          <h3>Filter by Type</h3>
          <div className={styles['filter-group']}>
            <button 
              className={selectedTypes.length === 0 ? styles.active : ""}
              onClick={() => toggleType("All")}
            >
              All Types
            </button>
            {types.map(type => (
              <button 
                key={type}
                className={selectedTypes.includes(type) ? styles.active : ""}
                onClick={() => toggleType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* 오른쪽 메인 콘텐츠: 카드 그리드 */}
      <main className={styles['cards-display']}>
        <div className={styles['cards-grid']}>
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <Card key={card.id} imageNum={card.id} />
            ))
          ) : (
            <div className={styles['no-results']}>
              <p>No cards found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyCards;
