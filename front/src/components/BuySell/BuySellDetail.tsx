import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './BuySell.css';

interface detailCard {
    sellerId: number;
    cardId: number;
    price: number;
    contactInfo: string;
    location: string;
    cardNameKo: string;
    status: string;
    officialImageUrl: string;
    imageStrings: string[];
    owner: boolean;
}

interface payment {
    sellerId: number;
    cardId: number;
    price: number;
}

const BuySellDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState<detailCard>();
    const [imageList, setImageList] = useState<string[]>([]);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);


    const BASE_URL = "http://localhost:8080/pokemon/";

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await api.get('/api/market/detail', {
                    params: { listId: id }
                });
                setItem(response.data);

                const combined = [
                    response.data.officialImageUrl,
                    ...(response.data.imageStrings || [])
                ].filter(Boolean); // 혹시 모를 null/undefined 제거

                setImageList(combined);

                // 데이터 로드 시 리스트의 첫 번째 이미지(오피셜)를 기본 선택
                if (combined.length > 0) {
                    setSelectedImg(combined[0]);
                }

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchCards();
    }, [id]);

    const handlePayment = () => {
        if (item == null) return;

        const paymentData: payment = {
            sellerId: item.sellerId,
            cardId: item.cardId,
            price: item.price
        };
        navigate('/buysell/payment/payment', { state: paymentData });
    }



    if (!item) return <div className="buysell-container">조회된 아이템이 없습니다.</div>;

    return (
        <div className="buysell-container">
            <button onClick={() => navigate('/buysell')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666' }}>← 돌아가기</button>
            <div className="detail-container">
                <div className="detail-image">
                    {imageList.length > 0 ? (
                        <div className="image-gallery">
                            <img src={`${BASE_URL}${selectedImg}`} alt="실물 사진 메인" />

                            <div className="small-previews" style={{ display: 'flex', gap: '5px', marginTop: '10px', cursor: 'pointer' }}>
                                {imageList.map((img, idx) => (
                                    <img
                                        key={idx}
                                        src={`${BASE_URL}${imageList[idx]}`}
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
                        {item.owner === true ? (
                            <>
                                <button onClick={() => alert("예약중 처리 로직")} className="btn-sell">
                                    예약중
                                </button>
                                <button onClick={() => alert("판매완료 처리 로직")} className="btn-confirm">
                                    판매완료
                                </button>
                            </>
                        ) : (
                            <button className="btn-buy" onClick={() => handlePayment()}>구매</button>
                        )}


                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuySellDetail;