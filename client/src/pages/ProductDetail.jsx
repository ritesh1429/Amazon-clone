import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { StarRating } from '../components/Navbar';
import { fetchProduct } from '../services/api';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then(r => setProduct(r.data.data))
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddToCart = async () => {
    const ok = await addItem(product.id, quantity);
    if (ok) showToast(`✓ ${product.name.slice(0, 40)}... added to cart`);
  };

  const handleBuyNow = async () => {
    await addItem(product.id, quantity);
    navigate('/cart');
  };

  if (loading) return <div className="spinner-container"><div className="spinner" /></div>;
  if (!product) return null;

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const deliveryDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="product-detail-page">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <a href="/">Home</a> ›
          <a href={`/?category=${encodeURIComponent(product.category_name)}`}>{product.category_name}</a> ›
          <span>{product.name.slice(0, 50)}...</span>
        </nav>

        <div className="detail-layout">
          {/* Left: Image Carousel */}
          <div className="detail-image-section">
            <div className="detail-carousel-thumbnails">
              {[
                product.image_url,
                product.image_url.replace('400/400', '401/401'),
                product.image_url.replace('400/400', '402/402'),
                product.image_url.replace('400/400', '403/403')
              ].map((img, idx) => (
                <div 
                  key={idx} 
                  className={`thumbnail-wrapper ${selectedImageIdx === idx ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedImageIdx(idx)}
                  onClick={() => setSelectedImageIdx(idx)}
                >
                  <img src={img} alt={`View ${idx+1}`} className="thumbnail-img" />
                </div>
              ))}
            </div>

            <div className="detail-image-wrapper">
              <img 
                src={[
                  product.image_url,
                  product.image_url.replace('400/400', '401/401'),
                  product.image_url.replace('400/400', '402/402'),
                  product.image_url.replace('400/400', '403/403')
                ][selectedImageIdx]} 
                alt={product.name} 
                className="detail-image" 
              />
              {product.badge && (
                <span className={`badge ${product.badge === 'Best Seller' ? 'badge-best-seller' : 'badge-amazons-choice'}`}>
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Middle: Info */}
          <div className="detail-info">
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-brand">
              Visit the <a href="#">{product.category_name} Store</a>
            </div>

            <div className="detail-rating">
              <StarRating rating={product.rating} />
              <a href="#reviews" className="rating-count">
                {Number(product.review_count).toLocaleString()} ratings
              </a>
              <span className="detail-rating-value">{product.rating} out of 5</span>
            </div>

            <hr className="detail-divider" />

            <div className="detail-price">
              <div className="price-header">
                {discount > 0 && <span className="price-tag">Deal</span>}
              </div>
              <div className="price-block">
                <span className="price-symbol">₹</span>
                <span className="price-current">{Number(product.price).toLocaleString('en-IN')}</span>
              </div>
              {discount > 0 && (
                <div className="price-savings">
                  M.R.P.: <span className="price-original">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
                  <span className="price-discount"> ({discount}% off)</span>
                </div>
              )}
              <div className="detail-inclusive">Inclusive of all taxes</div>
            </div>

            <hr className="detail-divider" />

            {/* Tabs */}
            <div className="detail-tabs">
              {['description', 'details'].map(tab => (
                <button
                  key={tab}
                  className={`detail-tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <div className="detail-tab-content">
              {activeTab === 'description' && (
                <p className="detail-description">{product.description}</p>
              )}
              {activeTab === 'details' && (
                <table className="detail-table">
                  <tbody>
                    <tr><td>Category</td><td>{product.category_name}</td></tr>
                    <tr><td>Rating</td><td>{product.rating} / 5</td></tr>
                    <tr><td>Reviews</td><td>{Number(product.review_count).toLocaleString()}</td></tr>
                    <tr><td>Availability</td><td style={{color: product.stock > 0 ? 'green' : 'red'}}>{product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}</td></tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Right: Buy Box */}
          <div className="detail-buy-box">
            <div className="buy-box-price">
              <span className="price-symbol">₹</span>
              <span className="buy-box-price-val">{Number(product.price).toLocaleString('en-IN')}</span>
            </div>

            <div className="buy-box-delivery">
              <span className="free-delivery">FREE delivery</span>
              <span className="delivery-date">{deliveryDate}</span>
            </div>

            <div className="buy-box-stock">
              {product.stock > 10
                ? <span className="in-stock">In Stock</span>
                : product.stock > 0
                ? <span className="low-stock">Only {product.stock} left in stock!</span>
                : <span className="out-stock">Currently unavailable</span>
              }
            </div>

            <div className="quantity-selector">
              <label>Qty:</label>
              <select
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                id="quantity-select"
              >
                {[...Array(Math.min(10, product.stock))].map((_, i) => (
                  <option key={i+1} value={i+1}>{i+1}</option>
                ))}
              </select>
            </div>

            <button className="btn-add-to-cart" onClick={handleAddToCart} id="add-to-cart-btn" disabled={product.stock === 0}>
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow} id="buy-now-btn" disabled={product.stock === 0}>
              Buy Now
            </button>

            <div className="buy-box-meta">
              <div>🔒 Secure transaction</div>
              <div>📦 Ships from: Amazon.in</div>
              <div>✅ Sold by: Amazon Retail</div>
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
