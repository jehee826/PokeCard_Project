import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import './BuySell.css';

const Payment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const item = mockItems.find(i => i.id === id);

    if (!item) return <div className="buysell-container">Item not found</div>;

    const handleConfirm = () => {
        alert('Payment successful!');
        navigate(`/buysell/detail/${item.id}`);
    };

    return (
        <div className="buysell-container">
            <div className="payment-container">
                <h2>Complete Your Purchase</h2>
                <div className="payment-details">
                    <p><strong>Item:</strong> {item.name}</p>
                    <p><strong>Total Price:</strong> ₩{item.price.toLocaleString()}</p>
                    <p><strong>Payment Method:</strong> Credit Card (Ending in 1234)</p>
                </div>
                <button className="btn-confirm" onClick={handleConfirm}>Confirm Payment</button>
                <button 
                    onClick={() => navigate(-1)} 
                    style={{ marginTop: '20px', background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Payment;
