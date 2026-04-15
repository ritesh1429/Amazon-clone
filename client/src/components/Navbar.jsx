import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Navbar.css';

function StarRating({ rating }) {
  return (
    <span className="stars">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= Math.round(rating) ? '#ff9900' : '#ddd' }}>★</span>
      ))}
    </span>
  );
}

export { StarRating };

export default function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 5);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Main Navbar */}
      <div className="navbar-main">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="nav-logo">
          <div className="logo-text">amazon<span className="logo-dot">.</span><span className="logo-in">in</span></div>
        </Link>

        {/* Deliver to */}
        <div className="navbar-location">
          <span className="location-label">Deliver to</span>
          <span className="location-name">📍 India</span>
        </div>

        {/* Search Bar */}
        <form className="navbar-search" onSubmit={handleSearch} id="search-form">
          <input
            type="text"
            className="search-input"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            id="search-input"
          />
          <button type="submit" className="search-btn" id="search-btn">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </form>

        {/* Account */}
        <div className="navbar-account">
          <span className="account-label">Hello, John</span>
          <span className="account-name">Account & Lists ▾</span>
        </div>

        {/* Returns */}
        <Link to="/orders" className="navbar-returns" style={{ textDecoration: 'none' }}>
          <span className="returns-label">Returns</span>
          <span className="returns-name">& Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="navbar-cart" id="nav-cart">
          <div className="cart-icon-wrapper">
            <svg className="cart-icon" viewBox="0 0 24 24" fill="currentColor" width="28" height="28">
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.34 17 7.5 17l11 .01c.55 0 1-.45 1-1s-.45-1-1-1H7.42c-.13 0-.25-.11-.25-.25l.03-.12L8.1 14h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 20 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
            {cartCount > 0 && (
              <span className="cart-badge" id="cart-count">{cartCount}</span>
            )}
          </div>
          <span className="cart-label">Cart</span>
        </Link>
      </div>

      {/* Sub Navbar */}
      <div className="navbar-sub">
        <div className="navbar-sub-content">
          <button className="sub-nav-btn sub-nav-btn-all" id="nav-all-btn">
            ☰ All
          </button>
          {['Today\'s Deals', 'Electronics', 'Books', 'Home & Kitchen', 'Sports', 'Clothing', 'Toys'].map(item => (
            <Link
              key={item}
              to={item === 'Today\'s Deals' ? '/' : `/?category=${encodeURIComponent(item)}`}
              className="sub-nav-link"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
