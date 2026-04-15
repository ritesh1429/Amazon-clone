import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import './Checkout.css';

const DEFAULT_ADDRESS = '123 Main Street, Koramangala, Bangalore, Karnataka - 560001';

export default function Checkout() {
  const { cartItems, cartTotal, clearCartLocal } = useCart();
  const navigate = useNavigate();
  const [address, setAddress] = useState(DEFAULT_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const deliveryFee = cartTotal >= 499 ? 0 : 40;
  const finalTotal = cartTotal + deliveryFee;
  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handlePlaceOrder = async () => {
    if (!address.trim()) { setError('Please enter a delivery address'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await placeOrder(address);
      clearCartLocal();
      navigate(`/order-success/${res.data.data.orderId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="checkout-heading">Checkout</h1>

        <div className="checkout-layout">
          {/* Left Column */}
          <div className="checkout-left">
            {/* Step 1: Address */}
            <div className="checkout-step">
              <div className="step-header">
                <span className="step-number">1</span>
                <h2 className="step-title">Delivery Address</h2>
              </div>
              <div className="step-content">
                <div className="address-card">
                  <div className="address-user-name">John Doe</div>
                  <textarea
                    className="address-input"
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    rows={3}
                    id="address-input"
                    placeholder="Enter your full delivery address"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment */}
            <div className="checkout-step">
              <div className="step-header">
                <span className="step-number">2</span>
                <h2 className="step-title">Payment Method</h2>
              </div>
              <div className="step-content">
                <div className="payment-options">
                  {[
                    { id: 'cod', icon: '💵', label: 'Cash on Delivery', desc: 'Pay when your order arrives', selected: true },
                    { id: 'upi', icon: '📱', label: 'UPI / Net Banking', desc: 'Instant payment', selected: false },
                    { id: 'card', icon: '💳', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, Amex', selected: false },
                  ].map(opt => (
                    <label key={opt.id} className={`payment-option ${opt.selected ? 'selected' : ''}`}>
                      <input type="radio" name="payment" defaultChecked={opt.selected} id={`pay-${opt.id}`} />
                      <span className="pay-icon">{opt.icon}</span>
                      <div>
                        <div className="pay-label">{opt.label}</div>
                        <div className="pay-desc">{opt.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Step 3: Items */}
            <div className="checkout-step">
              <div className="step-header">
                <span className="step-number">3</span>
                <h2 className="step-title">Review Items ({cartItems.length})</h2>
              </div>
              <div className="step-content">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-item">
                    <img src={item.image_url} alt={item.name} className="checkout-item-img" />
                    <div className="checkout-item-info">
                      <div className="checkout-item-name">{item.name}</div>
                      <div className="checkout-item-qty">Qty: {item.quantity}</div>
                    </div>
                    <div className="checkout-item-price">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="checkout-summary">
            {error && <div className="checkout-error">{error}</div>}
            <button
              className="place-order-btn"
              onClick={handlePlaceOrder}
              disabled={loading}
              id="place-order-btn"
            >
              {loading ? '⏳ Placing Order...' : 'Place your order'}
            </button>

            <div className="checkout-summary-card">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items ({cartItems.reduce((s, i) => s + i.quantity, 0)}):</span>
                <span>₹{Number(cartTotal).toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Delivery:</span>
                <span>{deliveryFee === 0 ? <span style={{color:'green'}}>FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <hr style={{ borderColor: '#ddd', margin: '10px 0' }} />
              <div className="summary-row total-row">
                <span>Order Total:</span>
                <span style={{ color: '#c40000' }}>₹{Number(finalTotal).toLocaleString('en-IN')}</span>
              </div>
              <p className="delivery-est">
                Estimated delivery by <strong>{deliveryDate}</strong>
              </p>
            </div>

            <div className="secure-badge">
              🔒 This is a secure, encrypted payment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
