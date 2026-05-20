import { useState, useEffect } from "react";
import Card from "../Middle/M/Card.tsx";
import styles from './MyDeals.module.css';
import api from "../../api/axios";

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
  buyer: boolean; // 추가된 인터페이스 활용
}

const MyDeals = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | "Buy" | "Sell">("All");
  const [tradeList, setTradeList] = useState<TradeHistory[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const token = sessionStorage.getItem('accessToken');
      try {
        const response = await api.get('/api/market/history', {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        setTradeList(response.data);
      } catch (error) {
        console.error("거래 내역 로딩 실패:", error);
      }
    };
    fetchHistory();
  }, []);

  // 필터링 로직: trade.buyer 플래그를 직접 사용
  const filteredCards = tradeList.filter(trade => {
    const matchesSearch = trade.cardNameKo.includes(searchTerm) || String(trade.cardId).includes(searchTerm);
    
    if (activeTab === "Buy") return matchesSearch && trade.buyer; // 내가 구매자일 때
    if (activeTab === "Sell") return matchesSearch && !trade.buyer; // 내가 판매자일 때
    return matchesSearch;
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
              placeholder="카드명 또는 ID 검색" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className={styles["filter-section"]}>
          <h3>Transaction Type</h3>
          <div className={styles["filter-group"]}>
            <button className={activeTab === "All" ? styles.active : ""} onClick={() => setActiveTab("All")}>전체 내역</button>
            <button className={activeTab === "Buy" ? styles.active : ""} onClick={() => setActiveTab("Buy")}>구매 내역</button>
            <button className={activeTab === "Sell" ? styles.active : ""} onClick={() => setActiveTab("Sell")}>판매 내역</button>
          </div>
        </div>
      </aside>

      <main className={styles['cards-display']}>
        <div className={styles['cards-grid']}>
          {filteredCards.length > 0 ? (
            filteredCards.map((trade) => (
              <div key={trade.historyId} className={styles['card-item-wrapper']}>
                <Card officialImageUrl={String(trade.officialImageUrl)} />
                <div className={styles['card-info-overlay']}>
                   <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
                     {trade.buyer ? "구매완료" : "판매완료"}
                   </span>
                   <p className={styles.priceText}>₩{trade.finalPrice.toLocaleString()}</p>
                   <small className={styles.dateText}>{trade.tradeDate.split('T')[0]}</small>
                </div>
              </div>
            ))
          ) : (
            <div className={styles['no-results']}>
              <p>{activeTab === "Buy" ? "구매한" : activeTab === "Sell" ? "판매한" : "거래"} 내역이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyDeals;