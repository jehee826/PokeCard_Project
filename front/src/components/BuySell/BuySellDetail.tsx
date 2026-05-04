import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './BuySell.css';

interface detailCard{
    sellerId: number;
    price: number;
    contactInfo: string;
    location: string;
    cardNameKo: string;
    status: string;
    officialImageUrl: string;
}

const BuySellDetail = () => {
    const { id } = useParams(); //url로 넘어온 값을 id에 넣음
    const navigate = useNavigate();
    const [item, setItem] = useState<detailCard>();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await api.get('/api/market/detail', {
                    params: { listId: id }
                });
                setItem(response.data);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchCards();
    }, []);

    console.log(id);

    if (!item) return <div className="buysell-container">조회된 아이템이 없습니다.</div>;

    return (
        <div className="buysell-container">
            <button onClick={() => navigate('/buysell')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666' }}>← Back to List</button>
            <div className="detail-container">
                <div className="detail-image">
                    <img src={item.officialImageUrl} alt={""} />
                </div>
                <div className="detail-info">
                    <h2>{item.cardNameKo}</h2>
                    <p style={{ color: '#666', marginBottom: '10px' }}>거래장소: {item.location}</p>
                    <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>연락처: {item.contactInfo}</p>
                    <div className="detail-price">₩{item.price.toLocaleString()}</div>
                    <div className="button-group">
                        <button className="btn-buy" onClick={() => navigate(`/buysell/payment/${item.sellerId}`)}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuySellDetail;
