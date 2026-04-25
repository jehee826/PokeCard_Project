import React, { useState } from 'react';
import styles from './Favorites.module.css';

const Favorites = () => {
  // 'buy' 또는 'sell' 상태를 관리
  const [viewMode, setViewMode] = useState('buy');

  // 샘플 데이터 (실제로는 DB나 API에서 가져오게 됩니다)
  // 카드 이미지, 구매 목표가, 판매 희망가를 포함하도록 확장
  const buyList = [
    { 
      id: 1, 
      name: '주리비안', 
      image: '/M3_004.png', 
      targetPrice: '150,000원', 
      currentMarket: '165,000원' 
    },
    { 
      id: 2, 
      name: '뮤츠 ex (포켓몬 카드 151)', 
      image: '/ball.png', 
      targetPrice: '80,000원', 
      currentMarket: '85,000원' 
    },
  ];

  const sellList = [
    { 
      id: 3, 
      name: '리자몽 ex (테라스탈)', 
      image: '/ball.png', 
      minPrice: '200,000원', 
      purchasePrice: '120,000원' 
    },
    { 
      id: 4, 
      name: '루카리오 V (스타터 세트)', 
      image: '/ball.png', 
      minPrice: '45,000원', 
      purchasePrice: '30,000원' 
    },
  ];

  const currentList = viewMode === 'buy' ? buyList : sellList;

  return (
    <div className={styles['favorites-container']}>
      <header className={styles['favorites-header']}>
        <h2>내 포켓몬 카드 위시리스트</h2>
      </header>

      {/* 상단 탭 바 */}
      <div className={styles["tabs"]}>
        <div 
          onClick={() => setViewMode('buy')}
          className={`${styles["tab"]} ${styles["buy"]} ${viewMode === 'buy' ? styles["active"] : ''}`}
        >
          구매 예정
        </div>
        <div 
          onClick={() => setViewMode('sell')}
          className={`${styles["tab"]} ${styles["sell"]} ${viewMode === 'sell' ? styles["active"] : ''}`}
        >
          판매 예정
        </div>
      </div>

      {/* 리스트 렌더링 */}
      <div className={styles["favorites-list"]}>
        {currentList.length > 0 ? (
          currentList.map(card => (
            <div key={card.id} className={styles["favorite-card"]}>
              <div className={styles["card-image-container"]}>
                <img src={card.image} alt={card.name} className={styles["card-image"]} />
              </div>
              
              <div className={styles["card-info"]}>
                <div className={styles["card-name"]}>{card.name}</div>
                
                <div className={styles["price-details"]}>
                  {viewMode === 'buy' ? (
                    <>
                      <div className={`${styles["price-row"]} ${styles["buy-price"]}`}>
                        <span className={styles["price-label"]}>구매 목표가</span>
                        <span className={styles["price-value"]}>{(card as { targetPrice: string }).targetPrice}</span>
                      </div>
                      <div className={`${styles["price-row"]} ${styles["market-price"]}`}>
                        <span className={styles["price-label"]}>현재 시세</span>
                        <span className={styles["price-value"]}>{(card as { currentMarket: string }).currentMarket}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={`${styles["price-row"]} ${styles["sell-price"]}`}>
                        <span className={styles["price-label"]}>판매 희망가</span>
                        <span className={styles["price-value"]}>{(card as { minPrice: string }).minPrice}</span>
                      </div>
                      <div className={`${styles["price-row"]} ${styles["buy-price"]}`}>
                        <span className={styles["price-label"]}>매입가</span>
                        <span className={styles["price-value"]}>{(card as { purchasePrice: string }).purchasePrice}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles["empty-message"]}>목록이 비어 있습니다.</div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
