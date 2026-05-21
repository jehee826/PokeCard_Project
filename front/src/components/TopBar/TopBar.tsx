import styles from './TopBar.module.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { useEffect, useState } from 'react';
// import Stomp from '@stomp/stompjs';
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client';

const TopBar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const { loginId } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSenderId, setLastSenderId] = useState<string | null>(null);

  const handleLoginClick = () => {
    navigate('/Login'); 
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/');
  };
  
  const handleChatClick = () => {
    navigate(`/Chat/${loginId}`); 
  };

  const handleNotificationClick = () => {
    if (lastSenderId) {
      navigate(`/Chat/${lastSenderId}`);
      setUnreadCount(0);
      setLastSenderId(null);
    } else {
      handleChatClick();
    }
  };
    const handleFavoriteClick = () => {
    navigate('/Favorites'); 
  };
      const handleMyCardsClick = () => {
    navigate('/Mycards'); 
  };
        const handleMyDealsClick = () => {
    navigate('/Mydeals'); 
  };
      const handleMarketplaceClick = () => {
    navigate('/buysell'); 
  };
      const mainHandleClick = () => {
    navigate('/');
  };


    // 1. 최신 Client 객체 생성 및 설정
useEffect(() => {
    // 💡 [수정 포인트 2] 비로그인 상태이거나 loginId가 없으면 웹소켓을 연결하지 않습니다.
    if (!isLoggedIn || !loginId) return;

    // 1. 최신 Client 객체 생성 및 설정 (useEffect 내부로 이동)
    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', 
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-stomp'),
      debug: (str) => console.log(`[STOMP] ${str}`),
      onConnect: (frame) => {
        console.log('알림 서비스 연결 성공');

        // 2. 내 로그인 ID 전용 알림 채널 상시 구독 시작!
        stompClient.subscribe(`/sub/notice/${loginId}`, (frame) => {
          const payload = JSON.parse(frame.body);
          
          // 3. 예외 처리: 만약 상대방이 이미 그 대화방(/Chat/룸ID) 안에 들어가 있다면 알림을 무시합니다.
          const currentPath = window.location.pathname;
          if (currentPath.includes(payload.sender)) {
            return; 
          }

          // 4. 대화방 밖에 있다면 안 읽은 알림 카운트를 올리고 팝업을 띄웁니다.
          setUnreadCount((prev) => prev + 1);
          setLastSenderId(payload.sender);
          
          if (window.confirm(`[대화 요청] ${payload.sender}님이 대화를 요청했습니다. 이동하시겠습니까?`)) {
            navigate(`/Chat/${payload.sender}`);
            setUnreadCount(0);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP 프로토콜 에러:', frame.headers['message']);
      }
    });

    // 5. 실제로 웹소켓 연결을 활성화(시작)합니다.
    stompClient.activate();

    // 6. 클린업 함수: 컴포넌트가 언마운트되거나 loginId/isLoggedIn이 바뀔 때 연결을 해제합니다.
    return () => {
      if (stompClient) {
        console.log('알림 서비스 연결 종료');
        stompClient.deactivate();
      }
    };
  }, [loginId, isLoggedIn]);

  return (
    <div className={styles["topBar"]}>
      <img className={styles["main_icon"]} src="/lightPokeLogo.png" alt="로고" onClick={mainHandleClick}/>
      
      <div className={styles["topBar-buttons"]}>
        {isLoggedIn && (
          <div className={styles["notification-container"]} onClick={handleNotificationClick}>
            <span className={styles["bell-icon"]}>🔔</span>
            {unreadCount > 0 && <span className={styles["badge"]}>{unreadCount}</span>}
          </div>
        )}

        <input 
          type="button" 
          value="대화 목록" 
          onClick={handleChatClick} 
        />
        <input 
          type="button" 
          value="관심 카드" 
          onClick={handleFavoriteClick} 
        />
        <input 
          type="button" 
          value="내 카드" 
          onClick={handleMyCardsClick} 
        />
         <input 
          type="button" 
          value="내 거래" 
          onClick={handleMyDealsClick} 
        />
          <input 
            type="button" 
            value="장터" 
            onClick={handleMarketplaceClick} 
          />

        {isLoggedIn ? (
          <input 
            type="button" 
            value="로그아웃" 
            onClick={handleLogoutClick} 
          />
        ) : (
          <input 
            type="button" 
            value="로그인" 
            onClick={handleLoginClick} 
          />
        )}
      </div>
    </div>
  );
}

export default TopBar;
