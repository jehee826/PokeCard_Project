import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './BuySell.css';

interface detailCard {
    sellerId: number;
    price: number;
    contactInfo: string;
    location: string;
    cardNameKo: string;
    status: string;
    officialImageUrl: string;
    imageStrings?: string[]; 
}

const BuySellDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<detailCard>();
    // [추가] 현재 크게 보여줄 이미지의 파일명을 저장하는 상태
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    const SERVER_URL = "http://localhost:8080/upload/images/";

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await api.get('/api/market/detail', {
                    params: { listId: id }
                });
                setItem(response.data);
                
                // [추가] 데이터 로드 시 실물 사진이 있다면 첫 번째 사진을 기본 선택
                if (response.data.imageStrings && response.data.imageStrings.length > 0) {
                    setSelectedImg(response.data.imageStrings[0]);
                }
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchCards();
    }, [id]);

    if (!item) return <div className="buysell-container">조회된 아이템이 없습니다.</div>;

    return (
        <div className="buysell-container">
            <button onClick={() => navigate('/buysell')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666' }}>← Back to List</button>
            <div className="detail-container">
                <div className="detail-image">
                    {item.imageStrings && item.imageStrings.length > 0 ? (
                        <div className="image-gallery">
                            {/* [수정] 고정된 index 0 대신 selectedImg 상태값을 사용 */}
                            <img src={`${SERVER_URL}${selectedImg}`} alt="실물 사진 메인" />
                            
                            <div className="small-previews" style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                                {item.imageStrings.map((img, idx) => (
                                    <img 
                                        key={idx} 
                                        src={`${SERVER_URL}${img}`} 
                                        // [추가] 클릭 시 selectedImg 상태 업데이트
                                        onClick={() => setSelectedImg(img)}
                                        style={{ 
                                            width: '50px', 
                                            height: '50px', 
                                            objectFit: 'cover',
                                            cursor: 'pointer',
                                            // [추가] 현재 선택된 사진에 테두리 효과 (선택사항)
                                            border: selectedImg === img ? '2px solid #3b82f6' : '1px solid #ddd'
                                        }} 
                                        alt={`미리보기 ${idx}`}
                                    />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <img src={item.officialImageUrl} alt="공식 이미지" />
                    )}
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