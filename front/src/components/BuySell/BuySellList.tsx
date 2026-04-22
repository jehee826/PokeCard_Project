import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockItems } from './mockData';
import './BuySell.css';

const BuySellList = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedType, setSelectedType] = useState("All");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const types = ["All", "Grass", "Fire", "Water", "Bug", "Dragon"];

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            alert(`Selected file: ${file.name}. (Image search functionality would be implemented here)`);
        }
    };

    const filteredItems = mockItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = selectedType === "All" || item.type === selectedType;
        return matchesSearch && matchesType;
    });


    return (
        <div className="buysell-container">
            <div className="buysell-header">
                         <h1>Card Marketplace</h1>   
                {/* 중앙 상단 검색 & 필터 & 카메라 */}
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
                                style={{ backgroundImage: `url(https://cards.image.pokemonkorea.co.kr/data/wmimages/MEGA/M3/M3_${item.imageNum}.png)` }}
                            />
                            <div className="item-info">
                                <h3>{item.name}</h3>
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
