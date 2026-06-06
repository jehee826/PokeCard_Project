import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import './BuySell.css';
import { useAuth } from '../AuthContext';

interface detailCard {
    listingId: number;
    sellerId: number;
    loginId: string;
    nickname: string;
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

const BuySellDetail = () => {
    const { loginId } = useAuth();
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


                if (combined.length > 0) {
                    setSelectedImg(combined[0]);
                }

            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchCards();
    }, [id]);

    const handleListStatus = async (id: number, status: string) => {
        try {
            const response = await api.post('/api/market/sellcomplete', {
                listId: String(id),
                status: status
            });
            if (response.status === 200) {
                alert(`${status} 상태변경`);
                navigate('/buysell');
            }
        } catch (error) {
            console.error("데이터 로딩 실패:", error);
        }

    }
    const roomId = (() => {
        if (!loginId || !item?.loginId) return '';
        return [loginId, item.loginId].sort().join('_');
    })();


    const handleStartChat = async () => {
        if (!loginId || !item) return;

        try {

            await api.post('/api/chat/request', {
                roomId: roomId,
                sender: loginId,
                receiver: item.loginId,
                message: `${loginId}님이 대화를 요청하셨습니다.`,
                content: `장터 아이템 [${item.cardNameKo}]에 대한 문의입니다.`
            });


            navigate(`/Chat/${item.loginId}`);
        } catch (error) {
            console.error('대화 요청 실패:', error);
            alert('대화 요청 중 오류가 발생했습니다.');
        }
    };


    if (!item) return <div className="buysell-container">조회된 아이템이 없습니다.</div>;

    return (
        <div className="buysell-container">
            <button onClick={() => navigate('/buysell')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                목록으로 돌아가기
            </button>

            <div className="detail-container">
                <div className="detail-image">
                    {imageList.length > 0 ? (
                        <div className="image-gallery">
                            <div className="main-image-wrapper" style={{ position: 'relative', width: '100%', aspectRatio: '2/2.8', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid var(--border-light)' }}>
                                <img
                                    src={`${BASE_URL}${selectedImg}`}
                                    alt="실물 사진 메인"
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>

                            <div className="small-previews" style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                                {imageList.map((img, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setSelectedImg(img)}
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '8px',
                                            overflow: 'hidden',
                                            cursor: 'pointer',
                                            border: selectedImg === img ? '2px solid var(--market-accent)' : '1px solid var(--border-light)',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <img
                                            src={`${BASE_URL}${img}`}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            alt={`미리보기 ${idx}`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="main-image-wrapper" style={{ width: '100%', aspectRatio: '2/2.8', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#f8fafc', border: '1px solid var(--border-light)' }}>
                            <img src={item.officialImageUrl} alt="공식 이미지" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                    )}
                </div>

                <div className="detail-info">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h2 style={{ margin: 0 }}>{item.cardNameKo}</h2>
                        <span style={{ backgroundColor: item.status === '판매중' ? '#e6fffa' : '#fff5f5', color: item.status === '판매중' ? '#319795' : '#e53e3e', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>
                            {item.status}
                        </span>
                    </div>

                    <h5 style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>판매자: <span style={{ color: 'var(--market-accent)' }}>{item.nickname}</span></h5>

                    <div style={{ backgroundColor: '#f7fafc', padding: '20px', borderRadius: '12px', marginBottom: '30px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}><strong>📍 거래장소:</strong> {item.location}</p>
                        <p style={{ margin: '0 0 10px 0', fontSize: '0.95rem' }}><strong>📱 연락처:</strong> {item.contactInfo}</p>
                        <p style={{ margin: 0, fontSize: '0.95rem' }}><strong>🏷️ 현재상태:</strong> {item.status}</p>
                    </div>

                    <div className="detail-price">₩{item.price.toLocaleString()}</div>

                    <div className="button-group" style={{ marginTop: '40px', gap: '15px' }}>
                        {item.owner === true ? (
                            <>
                                {item.status === "예약중" || item.status === "판매완료" ? (
                                    <button onClick={() => handleListStatus(Number(id), "판매중")} className="btn-sell" style={{ padding: '15px' }}>
                                        판매중으로 변경
                                    </button>
                                ) : (
                                    <button onClick={() => handleListStatus(Number(id), "예약중")} className="btn-booking" style={{ padding: '15px' }}>
                                        예약중으로 변경
                                    </button>)}

                                <button onClick={() => handleListStatus(Number(id), "판매완료")} className="btn-confirm" style={{ padding: '15px' }}>
                                    판매 완료 확정
                                </button>
                                <button onClick={() => navigate(`/buysell/edit/${item.listingId}`)} className="btn-edit" style={{ padding: '15px' }}>
                                    게시글 수정
                                </button>
                            </>
                        ) : (
                            <button onClick={handleStartChat} className="btn-buy" style={{ padding: '18px', fontSize: '1.1rem' }}>채팅으로 문의하기</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuySellDetail;