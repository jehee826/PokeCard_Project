import React, { useState, useEffect } from "react";
import Card from "./M/Card.tsx";
import styles from "./Middle.module.css";
import api from '../../api/axios'; //통신기능
import { useNavigate } from 'react-router-dom';

const Middle = () => {
  const navigate = useNavigate();
  const [fullCardList, setFullCardList] = useState<any[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedCardNum, setSelectedCardNum] = useState<string | null>(null);
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
    
  useEffect(() => {
  // location.state에서 전달된 cardNumber가 있으면 검색어로 설정
  const fetchCards = async () => {
      try {
          const response = await api.get('/api/main/ency');
          setFullCardList(response.data);
      } catch (error) {
          console.error("데이터 로딩 실패:", error);
      }
  };
  fetchCards();
}, []);

  // 카드 데이터베이스
  // const fullCardList = [
  //   { id: "001", type: "Grass" }, { id: "002", type: "Grass" }, { id: "003", type: "Grass" },
  //   { id: "004", type: "Fire" }, { id: "005", type: "Fire" }, { id: "006", type: "Fire" },
  //   { id: "007", type: "Water" }, { id: "008", type: "Water" }, { id: "009", type: "Water" },
  //   { id: "010", type: "Bug" }, { id: "011", type: "Bug" }, { id: "012", type: "Bug" },
  // ];

  const types = ["악", "초", "불", "벌레", "드래곤", "격투", "풀", "물", "번개", "에스퍼", "얼음", "고스트", "노말"];

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const image = event.dataTransfer.getData("image");
    const cardId = event.dataTransfer.getData("cardId");
    setSelectedCard(image);
    setSelectedCardNum(cardId);
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
    const handleSellerList = (cardId : number) => {
    navigate(`/buysell/seller/${cardId}`, { state: { cardId: cardId } });
  };


  // 검색 및 복수 필터링 로직
  const filteredCards = fullCardList.filter(card => {
    const matchesSearch = card.cardNumber.includes(searchTerm);
    const nameSearch = card.cardNameKo.includes(searchTerm);
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(card.attribute);
    return ( matchesSearch || nameSearch ) && matchesType;
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
                src={`${selectedCard}`} 
                alt="Selected Card" 
              />
            </div>
            <div className={styles["info-text"]}>
              <div className={styles["info-row"]}>
                <span className={styles.label}>INDEX:</span>
                <span className={styles.value}>{selectedCardNum}</span> {/* 카드 번호를 인덱스로 표시 */}
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
             <button className={`${styles["r-btn"]} ${styles.blue}`} onClick={AiCamera}>                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm7-3h-2.17l-1.33-1.5c-.38-.4-1.01-.5-1.5-.5H9c-.49 0-1.12.1-1.5.5L6.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                            </svg></button>
            <button className={`${styles["r-btn"]} ${styles.yellow}`} onClick={AiCamera}>                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm7-3h-2.17l-1.33-1.5c-.38-.4-1.01-.5-1.5-.5H9c-.49 0-1.12.1-1.5.5L6.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                            </svg></button>
          </div>
        </div>
      </div>

      {/* 오른쪽 목록 및 컨트롤 섹션 */}
      <div className={styles["right-section"]}>
        <div className={styles.controls}>
          <div className={styles["search-bar"]}>
            <input 
              type="text" 
              placeholder="도감 검색 EX) 리자몽 or 201/190" 
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
              <Card key={card.cardId} cardId={card.cardId} officialImageUrl={card.officialImageUrl} onClick={() => handleSellerList(card.cardId)} />
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