import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockItems } from './mockData';
import './BuySell.css';

const BuySellDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const item = mockItems.find(i => i.id === id);

    if (!item) return <div className="buysell-container">Item not found</div>;

    return (
        <div className="buysell-container">
            <button onClick={() => navigate('/buysell')} style={{ marginBottom: '20px', cursor: 'pointer', background: 'none', border: 'none', color: '#666' }}>← Back to List</button>
            <div className="detail-container">
                <div className="detail-image">
                    <img src={`https://cards.image.pokemonkorea.co.kr/data/wmimages/MEGA/M3/M3_${item.imageNum}.png`} alt={item.name} />
                </div>
                <div className="detail-info">
                    <h2>{item.name}</h2>
                    <p style={{ color: '#666', marginBottom: '10px' }}>Type: {item.type}</p>
                    <p style={{ marginBottom: '30px', lineHeight: '1.6' }}>This is a high-quality collectible card from the M3 series. Perfect for competitive play or display.</p>
                    <div className="detail-price">₩{item.price.toLocaleString()}</div>
                    <div className="button-group">
                        <button className="btn-buy" onClick={() => navigate(`/buysell/payment/${item.id}`)}>Buy Now</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuySellDetail;
