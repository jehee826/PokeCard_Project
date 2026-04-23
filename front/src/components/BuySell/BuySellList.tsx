import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios'; // axios 설정 파일
import './BuySell.css';

interface MarketCard {
    id: number;
    cardName: string;
    imageUrl: string;
    price: number;
}

const BuySellList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<MarketCard[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const types = ["All", "Grass", "Fire", "Water", "Bug", "Dragon"];

    // 페이지 로드 시 DB에서 데이터를 가져오는 useEffect
    useEffect(() => {
        const fetchCards = async () => {
            try {
                // 백엔드 컨트롤러 주소: /api/market/list
                const response = await api.get('/api/market/list');
                setItems(response.data);
            } catch (error) {
                console.error("데이터 로딩 실패:", error);
            }
        };
        fetchCards();
    }, []);

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`Selected file: ${file.name}. (Image search functionality would be implemented here)`);
        }
    };

    // 필터링 로직: 목업 데이터 대신 상태값(items)을 사용
    const filteredItems = items.filter(item => {
        // DTO 필드명인 cardName을 사용하도록 수정
        const matchesSearch = item.cardName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "All" || item.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="buysell-container">
            <div className="buysell-header">
                <h1>Card Marketplace</h1>   
                <div className="search-filter-container">
                    <div className="search-filter-group">
                        <div className="search-input-wrapper">
                            <input 
                                type="text" 
                                placeholder="Search cards..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="filter-select-wrapper">
                            <select 
                                value={selectedType} 
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                {types.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <button className="camera-btn" onClick={handleCameraClick} title="Search by image">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                <path d="M12 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm0-8c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm7-3h-2.17l-1.33-1.5c-.38-.4-1.01-.5-1.5-.5H9c-.49 0-1.12.1-1.5.5L6.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"/>
                            </svg>
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            style={{ display: 'none' }} 
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <button className="btn-sell-small" onClick={() => navigate('/buysell/sell')}>Sell My Card</button>
            </div>

            <div className="item-grid">
                {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                        <div key={item.id} className="item-card" onClick={() => navigate(`/buysell/detail/${item.id}`)}>
                            <div 
                                className="item-image" 
                                // DB에서 받아온 imageUrl을 그대로 배경으로 사용
                                style={{ backgroundImage: `url(${item.imageUrl})` }}
                            />
                            <div className="item-info">
                                {/* DTO 필드명인 cardName 사용 */}
                                <h3>{item.cardName}</h3>
                                <p className="item-price">₩{item.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-results">
                        <p>No cards found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuySellList;