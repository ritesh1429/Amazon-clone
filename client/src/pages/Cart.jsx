import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { cartItems, cartTotal, updateItem, removeItem, loading } = useCart();
  const navigate = useNavigate();

  const deliveryFee = cartTotal >= 499 ? 0 : 40;
  const finalTotal = cartTotal + deliveryFee;

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="cart-empty-content">
          <div className="cart-empty-img">🛒</div>
          <h2>Your Amazon Cart is empty</h2>
          <p>Your Shopping Cart lives to serve. Give it purpose — fill it with groceries, clothing, household supplies, electronics, and more.</p>
          <Link to="/" className="btn-primary" id="shop-now-btn" style={{ textDecoration: 'none', padding: '12px 24px', borderRadius: '5px' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <div className="cart-header">
              <h1 className="cart-title">Shopping Cart</h1>
              <span className="cart-price-header">Price</span>
            </div>
            <hr className="cart-divider" />

            {cartItems.map(item => {
              const discount = item.original_price
                ? Math.round((1 - item.price / item.original_price) * 100)
                : 0;
              return (
                <div className="cart-item" key={item.id} id={`cart-item-${item.id}`}>
                  <Link to={`/product/${item.product_id}`} className="cart-item-image-link">
                    <img src={item.image_url} alt={item.name} className="cart-item-image" />
                  </Link>
                  <div className="cart-item-info">
                    <Link to={`/product/${item.product_id}`} className="cart-item-name">{item.name}</Link>
                    <div className="cart-item-stock">
                      {item.stock > 0 ? <span className="in-stock-label">In Stock</span> : <span className="out-stock-label">Out of Stock</span>}
                    </div>
                    {discount > 0 && (
                      <div className="cart-item-discount">You save {discount}%</div>
                    )}
                    <div className="cart-item-actions">
                      <div className="qty-control">
                        <button
                          className="qty-btn"
                          onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)}
                          id={`qty-dec-${item.id}`}
                          disabled={loading}
                        >−</button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          id={`qty-inc-${item.id}`}
                          disabled={loading || item.quantity >= item.stock}
                        >+</button>
                      </div>
                      <span className="action-separator">|</span>
                      <button
                        className="cart-action-btn"
                        onClick={() => removeItem(item.id)}
                        id={`remove-${item.id}`}
                        disabled={loading}
                      >Delete</button>
                      <span className="action-separator">|</span>
                      <Link to={`/product/${item.product_id}`} className="cart-action-btn">View Item</Link>
                    </div>
                  </div>
                  <div className="cart-item-price">
                    <span className="item-price-symbol">₹</span>
                    <span className="item-price-val">{Number(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    {item.quantity > 1 && (
                      <div className="item-unit-price">₹{Number(item.price).toLocaleString('en-IN')} each</div>
                    )}
                  </div>
                </div>
              );
            })}

            <hr className="cart-divider" />
            <div className="cart-subtotal-row">
              Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items):
              <strong> ₹{Number(cartTotal).toLocaleString('en-IN')}</strong>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <div className="summary-card">
              {cartTotal >= 499
                ? <div className="free-delivery-banner">✓ Your order qualifies for FREE Delivery.</div>
                : <div className="delivery-notice">Add ₹{(499 - cartTotal).toFixed(0)} more for FREE delivery</div>
              }
              <div className="summary-line">
                <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span>₹{Number(cartTotal).toLocaleString('en-IN')}</span>
              </div>
              {deliveryFee > 0 && (
                <div className="summary-line">
                  <span>Delivery</span>
                  <span>₹{deliveryFee}</span>
                </div>
              )}
              <hr style={{ borderColor: '#ddd', margin: '10px 0' }} />
              <div className="summary-total">
                <span>Order Total</span>
                <span>₹{Number(finalTotal).toLocaleString('en-IN')}</span>
              </div>
              <button
                className="checkout-btn"
                onClick={() => navigate('/checkout')}
                id="checkout-btn"
              >
                Proceed to Checkout ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
