import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { availableCards } from './mockData';
import './BuySell.css';

const SellRegistration = () => {
    const [selectedCardId, setSelectedCardId] = useState('');
    const [price, setPrice] = useState('');
    const navigate = useNavigate();

    const handleRegister = () => {
        if (!selectedCardId || !price) {
            alert('Please select a card and enter a price.');
            return;
        }
        alert('Card registered successfully!');
        // In a real app, we'd get the new ID from the server
        navigate('/buysell/detail/1'); 
    };

    return (
        <div className="buysell-container">
            <h1 style={{ marginBottom: '30px' }}>Register Card for Sale</h1>
            <div className="sell-registration-container">
                <div className="sell-left">
                    {selectedCardId ? (
                        <img 
                            src={`https://cards.image.pokemonkorea.co.kr/data/wmimages/MEGA/M3/M3_${selectedCardId}.png`} 
                            alt="Preview" 
                        />
                    ) : (
                        <p className="placeholder-text">Please select a card to see preview</p>
                    )}
                </div>
                <div className="sell-right">
                    <div className="form-group">
                        <label>Select Card</label>
                        <select 
                            value={selectedCardId} 
                            onChange={(e) => setSelectedCardId(e.target.value)}
                        >
                            <option value="">-- Choose a Card --</option>
                            {availableCards.map(card => (
                                <option key={card.id} value={card.id}>{card.name} (#{card.id})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Price (KRW)</label>
                        <input 
                            type="number" 
                            placeholder="Enter price" 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <button className="btn-buy" onClick={handleRegister}>Register for Sale</button>
                    <button 
                        className="btn-sell" 
                        onClick={() => navigate('/buysell')}
                        style={{ marginTop: '10px' }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellRegistration;
