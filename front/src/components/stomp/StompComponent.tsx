import React, { useEffect, useState, useMemo } from 'react';
import { Client, type IFrame, type IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../AuthContext';
import { useParams } from 'react-router-dom';

interface MessagesType {
	sender: string; // 보내는 주체
	content: string; // 보내는 메시지
}

interface StompComponentProps {
	opponentId?: string;
}

const StompComponent: React.FC<StompComponentProps> = ({ opponentId: propOpponentId }) => {
	// const accessToken = sessionStorage.getItem("accessToken");
	const { loginId } = useAuth();
	const { opponentId: paramOpponentId } = useParams<{ opponentId: string }>();
	const opponentId = propOpponentId || paramOpponentId;

	const SERVER_URL = 'http://localhost:8080/ws-stomp'; // STOMP 연결 엔드포인트
	// const SERVER_URL = `https://thrower-unnerve-tux.ngrok-free.dev/ws-stomp?token=${accessToken}`; // STOMP 연결 엔드포인트
	
	// 두 사용자의 ID를 정렬하여 유일한 방 ID 생성 (예: userA_userB)
	const roomId = useMemo(() => {
		if (!loginId || !opponentId) return '';
		return [loginId, opponentId].sort().join('_');
	}, [loginId, opponentId]);

	const PUB_ENDPOINT = `/pub/chat/${roomId}`; // 메시지를 전송하기 위한 엔드포인트
	const SUB_ENDPOINT = `/sub/chat/${roomId}`; // 메시지를 수신하기 위한 엔드포인트

	// STOMP가 연결되고 생성한 Client를 관리하는 상태 관리
	const [wsClient, setWsClient] = useState<Client>();

	// 채팅방 입장 여부
	const [isEnterChat, setIsEnterChat] = useState<boolean>(false);

	// 채팅에서 누적되는 데이터를 관리합니다.
	const [messages, setMessages] = useState<MessagesType[]>([]);

	// 채팅에서 보내지는 데이터를 관리합니다.
	const [messageObj, setMessageObj] = useState<MessagesType>({
		content: '',
		sender: loginId || 'anonymous',
	});

	/**
	 * STOMP를 연결하고 라이프사이클을 관리하는 Handler
	 */
	const stompHandler = (() => {
		return {
			/**
			 * STOMP 연결을 시도합니다.
			 * @returns
			 */
			connect: () => {
				if (!roomId) {
					console.error("Room ID is not defined.");
					return;
				}
				// [STEP1] 연결 시 Client 객체를 생성합니다.
				const client = new Client({
					webSocketFactory: () => new SockJS(SERVER_URL),
					reconnectDelay: 5000,
					heartbeatIncoming: 4000,
					heartbeatOutgoing: 4000,

					// [STEP2] 웹 소켓 연결
					onConnect: (conn: IFrame) => {
						console.log('[+] WebSocket 연결이 되었습니다.', conn);
						setIsEnterChat(true); // 채팅방 입장여부 상태를 변경
						// [WebSocket - Subscribe] 특정 엔드포인트로 메시지를 수신합니다.
						client.subscribe(SUB_ENDPOINT, (message: IMessage) => {
							try {
								const receiveData = JSON.parse(message.body);
								setMessages((prev) => [...prev, {
									content: receiveData.content,
									sender: receiveData.sender,
								}]);
							} catch (error) {
								console.warn("수신된 메시지가 JSON 형식이 아닙니다:", message.body);
								setMessages((prev) => [...prev, {
									content: message.body,
									sender: 'system', 
								}]);
							}
						});
					},
					// 웹 소켓 연결 종료
					onWebSocketClose: (close) => {
						console.log('[-] WebSocket 연결이 종료 되었습니다.', close);
					},
					// 웹 소켓 연결 에러
					onWebSocketError: (error) => {
						console.error('[-] 웹 소켓 연결 오류가 발생하였습니다.', error);
					},
					// STOMP 프로토콜 에러
					onStompError: (frame) => {
						console.error('Broker reported error: ' + frame.headers['message']);
						console.error('Additional details: ' + frame.body);
					},
				});
				setWsClient(client); // 구성한 Client 객체를 상태 관리에 추가합니다.
				client.activate(); // Client를 활성화 합니다.
			},
			/**
			 * 웹 소켓 메시지를 전송합니다.
			 */
			sendMessage: () => {
				if (wsClient && wsClient.connected && messageObj.content.trim() !== '' && loginId) {
					// [WebSocket - Publish] 특정 엔드포인트로 메시지를 전송합니다.
					wsClient.publish({
						destination: PUB_ENDPOINT,
						body: JSON.stringify({ ...messageObj, sender: loginId, roomId: roomId }),
					});
					// 입력한 값을 초기화합니다.
					setMessageObj({ content: '', sender: loginId });
				}
			},
			/**
			 * 웹 소켓 연결을 종료합니다.
			 */
			disconnect: () => {
				console.log('[-] 웹 소켓 연결을 종료합니다.');
				if (wsClient) {
					wsClient.deactivate();
					setWsClient(undefined);
					setIsEnterChat(false);
				}
			},
		};
	})();

	// 컴포넌트 언마운트 시 연결 종료
	useEffect(() => {
		return () => {
			if (wsClient) {
				wsClient.deactivate();
			}
		};
	}, [wsClient]);

	if (!loginId) {
		return <div>로그인이 필요합니다.</div>;
	}

	return (
		<div className='stomp-container'>
			<aside style={{ position: 'absolute', top: 10, left: 10 }}>
				가나다라
			</aside>
			{!isEnterChat ? (
				<div
					style={{
						flexDirection: 'column',
						justifyContent: 'center',
						alignContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
					}}>
					<h2>{opponentId}님과 대화를 시작하시겠습니까?</h2>
					<button style={{borderRadius: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', cursor: 'pointer'}}onClick={stompHandler.connect}>대화 시작</button>
				</div>
			) : (
				<div
					style={{
						flex: 1,
						flexDirection: 'column',
						justifyContent: 'center',
						alignContent: 'center',
						alignItems: 'center',
						textAlign: 'center',
					}}>
					<h1>{opponentId}님과의 채팅방입니다.</h1>
					<div style={{ flexDirection: 'row' }}>
						<input
							type='text'
							value={messageObj.content}
							onChange={(e) => setMessageObj({ ...messageObj, content: e.target.value })}
							onKeyPress={(e) => {
								if (e.key === 'Enter') stompHandler.sendMessage();
							}}
						/>
						<button onClick={stompHandler.sendMessage}>전송</button>
					</div>
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							height: 300,
							overflowY: 'auto',
							backgroundColor: '#f5d682',
							border: '1px solid red',
							marginLeft: 20,
							marginRight: 20,
							borderRadius: '20px',
							margin: 20,
							padding: 10
						}}>
						{messages.map((item, index) => (
							<div
								style={{
									textAlign: item.sender === loginId ? 'right' : 'left',
									margin: '5px 0'
								}}
								key={`messages-${index}`}>
								<span style={{
									backgroundColor: item.sender === loginId ? '#fff' : '#e1ffc7',
									padding: '5px 10px',
									borderRadius: '10px',
									fontSize: 14
								}}>
									{item.content}
								</span>
								<div style={{ fontSize: 10, color: '#666' }}>{item.sender}</div>
							</div>
						))}
					</div>
					<div style={{ marginTop: 10 }}>
						<button onClick={stompHandler.disconnect}> 대화 종료 </button>
					</div>
				</div>
			)}
		</div>
	);
};

export default StompComponent;
