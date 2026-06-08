import styles from '../Middle.module.css';
import React, { useState } from 'react';
import ip from "../../../../default.ts"

interface CardProps {
  officialImageUrl: string;
  cardId?: number;
  onClick?: () => void;
  onDragStartAction?: () => void; 
  onDragEndAction?: () => void;  
}

const Card = ({ cardId, officialImageUrl, onClick, onDragStartAction, onDragEndAction }: CardProps) => {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  const [isHovering, setIsHovering] = useState<boolean>(false);

  const BASE_URL = `http://${ip}:8080/pokemon/`;

  // 3. 마우스 이벤트의 타입을 지정합니다. (div 요소에서 발생하는 마우스 이벤트)
  const mouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    setIsHovering(true);
    // nativeEvent를 통해 offsetY, offsetX 값을 가져옵니다.
    setX((event.nativeEvent.offsetY - 150) / 6);
    setY(-(event.nativeEvent.offsetX - 100) / 3);
  };

  const Reset = () => {
    setIsHovering(false);
    setX(0);
    setY(0);
  };
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      Reset();
    }

  }

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
    event.dataTransfer.setData("image", BASE_URL + officialImageUrl);
    event.dataTransfer.setData("cardId", String(cardId));
    if(onDragStartAction) onDragStartAction();
  };

  const handleDragEnd = () => {
    if (onDragEndAction) onDragEndAction(); 
  };

  return (
    <div className={styles.cardTitle}>
      <div
        className={styles.card}
        draggable={true}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseMove={mouseMove}
        onMouseLeave={Reset}
        onClick={handleClick}
        style={{
          transform: `rotateX(${x}deg) rotateY(${y}deg)`,
          transition: isHovering
            ? 'transform 0.2s ease-out'
            : 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
          backgroundImage: `url(${BASE_URL}${officialImageUrl})`,
        }}
      >
        <div
          className={styles.overlay}
          style={{
            background: `radial-gradient( 
              circle at ${50 - y * 2}% ${50 + x * 2}%, 
              rgba(255, 255, 255, 0.4) 20px, 
              rgba(5, 56, 56, 0) 60%
            )`,
            opacity: isHovering ? 1 : 0
          }}
        />
      </div>
    </div>
  );
};

export default Card;