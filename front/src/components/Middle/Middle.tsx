import React, { useState, useEffect } from "react";
import Card from "./M/Card.tsx";
import styles from "./Middle.module.css";
import { useNavigate } from 'react-router-dom';

const Middle = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  // 1. 초기값 설정: sessionStorage에 저장된 값이 있으면 가져오고, 없으면 빈 문자열("")을 사용합니다.
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem('search_term') || "";
  });
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // 2. 검색어가 바뀔 때마다 sessionStorage에 실시간으로 저장합니다.
  useEffect(() => {
    sessionStorage.setItem('search_term', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
        sessionStorage.removeItem('login_id');
        sessionStorage.removeItem('login_pw');
        sessionStorage.removeItem('login_isOn');
    }, []);

  // 카드 데이터베이스
  const fullCardList = [
    { id: "001", type: "Grass" }, { id: "002", type: "Grass" }, { id: "003", type: "Grass" },
    { id: "004", type: "Fire" }, { id: "005", type: "Fire" }, { id: "006", type: "Fire" },
    { id: "007", type: "Water" }, { id: "008", type: "Water" }, { id: "009", type: "Water" },
    { id: "010", type: "Bug" }, { id: "011", type: "Bug" }, { id: "012", type: "Bug" },
  ];

  const types = ["Grass", "Fire", "Water", "Bug", "Dragon"];

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const imageNum = event.dataTransfer.getData("imageNum");
    setSelectedCard(imageNum);
  };
    const AiCamera = () => {
    navigate('/AiCamera'); 
  };

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
    <div className={styles.middle}>
      {/* 왼쪽 스캔 패널 */}
      <div 
        className={styles["left-panel"]} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}
      >
        {/* 화면 반사 광택 효과 */}
        <div className={styles["screen-glare"]}></div>
        
        {/* 상단 상태 LED */}
        <div className={styles["status-leds"]}>
          <div className={`${styles.led} ${styles.red} ${styles.blink}`}></div>
          <div className={`${styles.led} ${styles.yellow}`}></div>
          <div className={`${styles.led} ${styles.green}`}></div>
        </div>

        {selectedCard ? (
          <div className={styles["card-info"]}>
            <div className={styles["scan-line"]}></div>
            <h3 className={styles["scanning-text"]}>DATA SCANNING...</h3>
            <div className={styles["info-image"]}>
              <img 
                src={`https://cards.image.pokemonkorea.co.kr/data/wmimages/MEGA/M3/M3_${selectedCard}.png`} 
                alt="Selected Card" 
              />
            </div>
            <div className={styles["info-text"]}>
              <div className={styles["info-row"]}>
                <span className={styles.label}>INDEX:</span>
                <span className={styles.value}>M3_{selectedCard}</span>
              </div>
              <div className={styles["info-row"]}>
                <span className={styles.label}>STATUS:</span>
                <span className={`${styles.value} ${styles.active}`}>ANALYZED</span>
              </div>
              <p className={styles.description}>▶ 대상의 유전자 정보와 카드 속성 데이터가 도감 데이터베이스에 성공적으로 등록되었습니다.</p>
            </div>
          </div>
        ) : (
          <div className={styles["drop-placeholder"]}>
            <div className={styles["scan-line-idle"]}></div>
            <p className={styles["system-ready"]}>[ SYSTEM READY ]</p>
            <p className={styles["hint-text"]}>AWAITING INPUT DATA...</p>
            <div className={styles["loading-spinner"]}></div>
          </div>
        )}

        {/* 하단 물리 버튼 및 스피커 데코레이션 */}
        <div className={styles["panel-deco-bottom"]}>
          <div className={styles["d-pad"]}>
            <div className={`${styles["d-btn"]} ${styles.up}`}></div>
            <div className={`${styles["d-btn"]} ${styles.left}`}></div>
            <div className={`${styles["d-btn"]} ${styles.right}`}></div>
            <div className={`${styles["d-btn"]} ${styles.down}`}></div>
          </div>
          <div className={styles["speaker-vents"]}>
            <span></span><span></span><span></span><span></span>
          </div>
          <div className={styles["round-btns"]}>
             <button className={`${styles["r-btn"]} ${styles.blue}`} onClick={AiCamera}></button>
            <button className={`${styles["r-btn"]} ${styles.yellow}`} onClick={AiCamera}></button>
          </div>
        </div>
      </div>

      {/* 오른쪽 목록 및 컨트롤 섹션 */}
      <div className={styles["right-section"]}>
        <div className={styles.controls}>
          <div className={styles["search-bar"]}>
            <input 
              type="text" 
              placeholder="도감 번호 검색 (001~012)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className={styles["filter-group"]}>
            <button 
              className={selectedTypes.length === 0 ? styles.active : ""}
              onClick={() => toggleType("All")}
            >
              All
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
        
        <div className={styles["right-panel"]}>
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <Card key={card.id} imageNum={card.id} />
            ))
          ) : (
            <div className={styles["no-results"]}>
              <p>데이터가 존재하지 않습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Middle;