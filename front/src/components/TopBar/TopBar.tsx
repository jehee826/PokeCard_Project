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


    // 1. 웹소켓 연결
//     const stompClient = new Client({
//   brokerURL: 'ws://localhost:8080/ws', // 웹소켓 네이티브 주소
//   webSocketFactory: () => new SockJS('http://localhost:8080/ws-stomp'), // SockJS 폴백용
//   onConnect: () => {
//     console.log('연결 성공');
//   }
// });
  const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
    if (!loginId) return;

    // 1. 최신 Client 객체 생성 및 설정
    const stompClient = new Client({
      // 스프링 부트 서버의 웹소켓 엔드포인트 주소
      brokerURL: 'ws://localhost:8080/ws', 
      
      // SockJS를 사용해야 하는 브라우저 환경을 위한 폴백(Fallback) 설정
      webSocketFactory: () => new SockJS('http://localhost:8080/ws-stomp'),
      debug: (str) => console.log(`[STOMP] ${str}`),
      onConnect: (frame) => {
        console.log('알림 서비스 연결 성공');

        // 2. 내 로그인 ID 전용 알림 채널 상시 구독 시작!
        stompClient.subscribe(`/sub/notice/${loginId}`, (frame) => {
          const payload = JSON.parse(frame.body);
          
          // 3. 예외 처리: 만약 상대방이 이미 그 대화방(/chat/룸ID) 안에 들어가 있다면 알림을 무시합니다.
          const currentPath = window.location.pathname;
          if (currentPath.includes(payload.roomId)) {
            return; 
          }

          // 4. 대화방 밖에 있다면 안 읽은 알림 카운트를 올리고 팝업을 띄웁니다.
          setUnreadCount((prev) => prev + 1);
          
          // 알림창을 누르면 해당 채팅방으로 이동할 수 있도록 구성 가능
          if (window.confirm(`[대화 요청] ${payload.senderId}님이 대화를 요청했습니다. 이동하시겠습니까?`)) {
            window.location.href = `/chat/${payload.roomId}`;
          }
        });
      },

      onStompError: (frame) => {
        console.error('STOMP 프로토콜 에러:', frame.headers['message']);
      }
    });

    // 5. 실제로 웹소켓 연결을 활성화(시작)합니다.
    stompClient.activate();

    // 6. 클린업 함수: 컴포넌트가 언마운트되거나 loginId가 바뀔 때 연결을 안전하게 해제합니다.
    return () => {
      if (stompClient) {
        stompClient.deactivate(); // 최신 버전은 disconnect() 대신 deactivate()를 권장합니다.
      }
    };
  }, [loginId]);

  return (
    <div className={styles["topBar"]}>
      <img className={styles["main_icon"]} src="/lightPokeLogo.png" alt="로고" onClick={mainHandleClick}/>
      <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: '#e0e0e0' }}>
      <h2>My App</h2>
      <div>
        <span>🔔 알림 {unreadCount}개</span>
        <span style={{ marginLeft: '10px' }}>{loginId}님 정방문</span>
      </div>
    </div>
      
      <div className={styles["topBar-buttons"]}>
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
