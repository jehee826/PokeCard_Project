import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; 
import './BuySell.css';

interface MyCard {
    cardId: number;
    cardNumber: string;
    cardNameKo: string;
    officialImageUrl: string;
    
}

const SellRegistration = () => {
    const [selectedCardId, setSelectedCardId] = useState('');
    const [items, setItems] = useState<MyCard[]>([]);
    const [price, setPrice] = useState('');
    const [contact, setContact] = useState('');
    const [location, setLocation] = useState('');
    const navigate = useNavigate();

    //판매글 등록
    const handleRegister = async () => {
        // 1. 유효성 검사
        if (!selectedCardId || !price || !location || !contact) {
            alert('모든 정보를 입력해주세요.');
            return;
        }

       const token = sessionStorage.getItem('accessToken');

        try {
            // 3. 백엔드로 POST 요청
            const response = await api.post('/api/market/register', {
                cardId: selectedCardId,
                price: price,
                contactInfo: contact,
                location: location,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                alert('판매 등록이 완료되었습니다!');
                navigate('/buysell'); // 등록 후 목록 페이지로 이동
            }
        } catch (error) {
            console.error("등록 실패:", error);
            alert('등록 중 오류가 발생했습니다.');
    }
    };

    //페이지 입장시 백엔드와 연동해 유저가 보유한 카드리스트를 가져옴
    useEffect(() => {
        const fetchCards = async () => {
            //토큰 꺼내기
            const token = sessionStorage.getItem('accessToken');
            
            //토큰이 없으면 리턴
            if (!token) {
                console.error("토큰이 없습니다. 로그인이 필요합니다.");
                return;
            }
            
            try {
                const response = await api.get('/api/market/mycard', {
                    //토큰 보내기
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                //받은 로그인한 유저가 보유중인 카드정보들
                setItems(response.data);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
            
        };
        fetchCards();
    }, []);

    return (
        <div className="buysell-container">
            <h1 style={{ marginBottom: '30px' }}>판매등록</h1>
            <div className="sell-registration-container">
                <div className="sell-left">
                    {selectedCardId ? (
                        // items 배열에서 현재 선택된(selectedCardId) 카드를 찾아서 그 카드의 이미지를 보여줌
                        <img 
                            src={items.find(card => String(card.cardId) === String(selectedCardId))?.officialImageUrl} 
                            alt="Preview" 
                        />
                    ) : (
                        <p className="placeholder-text">카드 미리보기</p>
                    )}
                </div>
                <div className="sell-right">
                    <div className="form-group">
                        <label>Select Card</label>
                        <select 
                            value={selectedCardId} 
                            onChange={(e) => setSelectedCardId(e.target.value)}
                        >
                            <option value="">-- 보유카드 --</option>
                            {items.map(card => (
                                <option key={card.cardNumber} value={card.cardId}>{card.cardNameKo} (#{card.cardNumber})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>가격</label>
                        <input 
                            type="number"
                            step="100" 
                            placeholder="가격입력" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                        <label>거래장소</label>
                        <input 
                            type="text" 
                            placeholder="거래장소" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <label>연락처</label>
                        <input 
                            type="text" 
                            placeholder="연락처" 
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                        />
                    </div>
                    <button className="btn-buy" onClick={handleRegister}>등록</button>
                    <button className="btn-sell" onClick={() => navigate('/buysell')}>취소</button>
                </div>
            </div>
        </div>
    );
};

export default SellRegistration;
