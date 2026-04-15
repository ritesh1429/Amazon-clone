import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <button className="footer-back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top
      </button>
      <div className="footer-main">
        <div className="footer-section">
          <h4>Get to Know Us</h4>
          <ul><li><a href="#">Careers</a></li><li><a href="#">Blog</a></li><li><a href="#">About Amazon</a></li><li><a href="#">Investor Relations</a></li></ul>
        </div>
        <div className="footer-section">
          <h4>Make Money with Us</h4>
          <ul><li><a href="#">Sell on Amazon</a></li><li><a href="#">Sell under Amazon Accelerator</a></li><li><a href="#">Amazon Associates</a></li><li><a href="#">Advertise Your Products</a></li></ul>
        </div>
        <div className="footer-section">
          <h4>Let Us Help You</h4>
          <ul><li><a href="#">Your Account</a></li><li><a href="#">Your Orders</a></li><li><a href="#">Shipping Rates & Policies</a></li><li><a href="#">Returns & Replacements</a></li><li><a href="#">Help</a></li></ul>
        </div>
        <div className="footer-section">
          <h4>Amazon Payment Products</h4>
          <ul><li><a href="#">Amazon Business Card</a></li><li><a href="#">Shop with Points</a></li><li><a href="#">Reload Your Balance</a></li><li><a href="#">Amazon Currency Converter</a></li></ul>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-logo">amazon<span>.in</span></div>
        <p>© 2024, Amazon.com, Inc. or its affiliates. All rights reserved.</p>
      </div>
    </footer>
  );
}
