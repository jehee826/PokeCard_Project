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



useEffect(() => {
    //비로그인 상태이거나 loginId가 없으면 웹소켓을 연결하지 않음
    if (!isLoggedIn || !loginId) return;


    const stompClient = new Client({
      brokerURL: 'ws://localhost:8080/ws', 
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-stomp'),
      debug: (str) => console.log(`[STOMP] ${str}`),
      onConnect: (frame) => {
        console.log('알림 연결 성공');


        stompClient.subscribe(`/sub/notice/${loginId}`, (frame) => {
          const payload = JSON.parse(frame.body);
          
          const currentPath = window.location.pathname;
          if (currentPath.includes(payload.sender)) {
            return; 
          }

          setUnreadCount((prev) => prev + 1);
          setLastSenderId(payload.sender);
          
          if (window.confirm(`[대화 요청] ${payload.sender}님이 대화를 요청했습니다.`)) {
            navigate(`/Chat/${payload.sender}`);
            setUnreadCount(0);
          }
        });
      },
      onStompError: (frame) => {
        console.error('STOMP 에러:', frame.headers['message']);
      }
    });

    stompClient.activate();

    return () => {
      if (stompClient) {
        console.log('알림 연결 종료');
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
