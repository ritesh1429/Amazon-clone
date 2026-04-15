import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrder } from '../services/api';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder(id)
      .then(r => setOrder(r.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="success-page">
      <div className="container">
        <div className="success-card">
          {/* Header */}
          <div className="success-header">
            <div className="success-checkmark-ring">
              <div className="success-checkmark">✓</div>
            </div>
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-subtitle">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Info */}
          <div className="success-info-grid">
            <div className="info-box">
              <div className="info-label">Order ID</div>
              <div className="info-value" id="order-id">#{String(id).padStart(6, '0')}</div>
            </div>
            <div className="info-box">
              <div className="info-label">Order Date</div>
              <div className="info-value">
                {order ? new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
              </div>
            </div>
            <div className="info-box">
              <div className="info-label">Order Total</div>
              <div className="info-value" style={{ color: '#c40000' }}>
                ₹{order ? Number(order.total).toLocaleString('en-IN') : '—'}
              </div>
            </div>
            <div className="info-box">
              <div className="info-label">Status</div>
              <div className="info-value status-placed">{order?.status || 'Placed'}</div>
            </div>
          </div>

          {/* Delivery */}
          <div className="delivery-timeline">
            <div className="timeline-item done">
              <div className="timeline-dot">✓</div>
              <div>
                <div className="timeline-label">Order Placed</div>
                <div className="timeline-sub">Today</div>
              </div>
            </div>
            <div className="timeline-line"></div>
            <div className="timeline-item">
              <div className="timeline-dot active">📦</div>
              <div>
                <div className="timeline-label">Processing</div>
                <div className="timeline-sub">1-2 days</div>
              </div>
            </div>
            <div className="timeline-line"></div>
            <div className="timeline-item">
              <div className="timeline-dot">🚚</div>
              <div>
                <div className="timeline-label">Out for Delivery</div>
                <div className="timeline-sub">{deliveryDate}</div>
              </div>
            </div>
            <div className="timeline-line"></div>
            <div className="timeline-item">
              <div className="timeline-dot">🏠</div>
              <div>
                <div className="timeline-label">Delivered</div>
                <div className="timeline-sub">Estimated</div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          {order?.items?.length > 0 && (
            <div className="success-items">
              <h3 className="items-heading">Items in this Order</h3>
              <div className="items-list">
                {order.items.map((item, i) => (
                  <div key={i} className="success-item">
                    <img src={item.image_url} alt={item.name} className="success-item-img" />
                    <div className="success-item-info">
                      <div className="success-item-name">{item.name}</div>
                      <div className="success-item-meta">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</div>
                    </div>
                    <div className="success-item-total">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="success-actions">
            <Link to="/" className="continue-btn" id="continue-shopping-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
