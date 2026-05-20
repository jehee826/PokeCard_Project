import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../api/axios';

// 전달받은 데이터의 타입 정의
interface PaymentData {
    sellerId: number;
    cardId: number;
    price: number;
}

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // 이전 페이지에서 넘겨준 state 받기
    const paymentData = location.state as PaymentData;

    // 만약 데이터가 없이 접근했다면 이전으로 돌려보냄
    if (!paymentData) {
        return (
            <div className="buysell-container">
                <p>결제 정보가 존재하지 않습니다.</p>
                <button onClick={() => navigate(-1)}>뒤로 가기</button>
            </div>
        );
    }

    const handleConfirmPurchase = async () => {
        try {
            // 백엔드로 정보 3개 전송 (buyerId는 서버에서 토큰으로 처리)
            const response = await api.post('/api/market/payment', {
                sellerId: paymentData.sellerId,
                cardId: paymentData.cardId,
                finalPrice: paymentData.price
            });

            // 백엔드에서 OK(200 등) 응답이 오면
            if (response.status === 200 || response.status === 201) {
                alert("구매가 완료되었습니다!");
                // 완료 후 목록 페이지나 마이페이지 등으로 이동
                navigate('/buysell');
            }
        } catch (error: any) {
            console.error("구매 처리 중 오류 발생:", error);
            // 백엔드에서 에러 메시지를 던져준 경우 해당 메시지 출력
            const errorMsg = error.response?.data?.message || "구매 처리 중 오류가 발생했습니다.";
            alert(errorMsg);
        }
    };

    return (
        <div className="buysell-container">
            <h2>결제 확인</h2>
            <div className="payment-box" style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <p>상품 가격: <strong>₩{paymentData.price.toLocaleString()}</strong></p>
                <p>위 금액으로 구매를 확정하시겠습니까?</p>
                
                <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                    <button 
                        onClick={handleConfirmPurchase}
                        style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        결제하기
                    </button>
                    <button 
                        onClick={() => navigate(-1)}
                        style={{ padding: '10px 20px', backgroundColor: '#eee', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;