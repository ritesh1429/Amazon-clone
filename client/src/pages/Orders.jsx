import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrderHistory } from '../services/api';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderHistory()
      .then(res => setOrders(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;

  return (
    <div className="orders-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <Link to="/">Home</Link> › <span>Your Orders</span>
        </nav>

        <h1 className="orders-title">Your Orders</h1>

        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <h3>No orders found</h3>
            <p>Looks like you haven't placed an order yet.</p>
            <Link to="/" className="btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-header-left">
                    <div className="order-meta">
                      <span className="order-meta-label">ORDER PLACED</span>
                      <span>{new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div className="order-meta">
                      <span className="order-meta-label">TOTAL</span>
                      <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="order-meta">
                      <span className="order-meta-label">DISPATCH TO</span>
                      <span className="order-address-truncate">{order.address.split(',')[0]}</span>
                    </div>
                  </div>
                  <div className="order-header-right">
                    <div className="order-meta">
                      <span className="order-meta-label">ORDER # {String(order.id).padStart(6, '0')}</span>
                      <Link to={`/order-success/${order.id}`} className="order-details-link">View Order Details</Link>
                    </div>
                  </div>
                </div>

                <div className="order-body">
                  <h3 className="order-status">{order.status === 'Placed' ? 'Arriving soon' : order.status}</h3>
                  <div className="order-items">
                    {order.items.map(item => (
                      <div key={item.id} className="order-item">
                        <Link to={`/product/${item.product_id}`}>
                          <img src={item.image_url} alt={item.name} className="order-item-img" />
                        </Link>
                        <div className="order-item-info">
                          <Link to={`/product/${item.product_id}`} className="order-item-name">{item.name}</Link>
                          <div className="order-item-qty">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}</div>
                          <div className="order-actions">
                            <Link to={`/product/${item.product_id}`} className="btn-buy-again">Buy it again</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
