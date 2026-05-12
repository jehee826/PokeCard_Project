import React, { useState, useEffect } from "react";
import Card from "../Middle/M/CardCopy.tsx";
import styles from './MyDeals.module.css';
import api from "../../api/axios"; // axios 인스턴스 임포트

// 백엔드 TradeHistoryDTO와 일치하는 인터페이스
interface TradeHistory {
  historyId: number;
  buyerId: number;
  sellerId: number;
  cardId: number;
  finalPrice: number;
  tradeDate: string;
  cardNumber: string;
  cardNameKo: string; 
  rarityCode: string; 
  attribute: string;
  officialImageUrl: string;
}

const MyDeals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // 상태 관리: 실제 DB에서 가져온 리스트
  const [tradeList, setTradeList] = useState<TradeHistory[]>([]);

  // 현재 로그인한 사용자의 ID (실제로는 recoil, context, 혹은 decode한 토큰에서 가져와야 함)
  // 일단 예시로 1번을 내 ID라고 가정합니다.
  const myUserId = 1; 

  // 데이터 불러오기
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/market/history');
        setTradeList(response.data);
      } catch (error) {
        console.error("거래 내역 로딩 실패:", error);
      }
    };

    fetchHistory();
  }, []);

  const types = ["Buy", "Sell"]; // 타입을 Grass/Fire 대신 구매/판매로 변경 (일단은 예시)

  // 타입 토글 핸들러 (구매/판매 필터링용으로 활용 가능)
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

  // DB 데이터를 기반으로 필터링
  const filteredCards = tradeList.filter(trade => {
    // 1. 검색어 필터 (카드 ID 기준)
    const matchesSearch = String(trade.cardId).includes(searchTerm);
    
    // 2. 타입 필터 (구매/판매 기준)
    const isBuy = trade.buyerId === myUserId;
    const isSell = trade.sellerId === myUserId;
    
    let matchesType = true;
    if (selectedTypes.length > 0) {
      matchesType = (selectedTypes.includes("Buy") && isBuy) || 
                    (selectedTypes.includes("Sell") && isSell);
    }
    
    return matchesSearch && matchesType;
  });


  return (
    <div className={styles['my-cards-container']}>
      <aside className={styles["sidebar"]}>
        <h2 className={styles["sidebar-title"]}>My Transactions</h2>
        
        <div className={styles["search-section"]}>
          <h3>Search Card</h3>
          <div className={styles["search-bar"]}>
            <input 
              type="text" 
              placeholder="Card ID 검색" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles["filter-section"]}>
          <h3>Filter by Status</h3>
          <div className={styles["filter-group"]}>
            <button 
              className={selectedTypes.length === 0 ? styles.active : ""}
              onClick={() => toggleType("All")}
            >
              All Records
            </button>
            {types.map(type => (
              <button 
                key={type}
                className={selectedTypes.includes(type) ? styles.active : ""}
                onClick={() => toggleType(type)}
              >
                {type === "Buy" ? "구매 내역" : "판매 내역"}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <main className={styles['cards-display']}>
        <div className={styles['cards-grid']}>
          {filteredCards.length > 0 ? (
            filteredCards.map((trade) => (
              <div key={trade.historyId} className={styles['card-item-wrapper']}>
                 {/* Card 컴포넌트에 cardId를 넘겨 이미지 표시 */}
                <Card imageUrl={String(trade.officialImageUrl)} />
                <div className={styles['card-info-overlay']}>
                   <span className={trade.buyerId === myUserId ? styles.tagBuy : styles.tagSell}>
                     {trade.buyerId === myUserId ? "구매" : "판매"}
                   </span>
                   <p>₩{trade.finalPrice.toLocaleString()}</p>
                </div>
              </div>
            ))
          ) : (
            <div className={styles['no-results']}>
              <p>거래 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyDeals;