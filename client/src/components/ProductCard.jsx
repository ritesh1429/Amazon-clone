import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { StarRating } from './Navbar';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [added, setAdded] = React.useState(false);

  const discount = product.original_price
    ? Math.round((1 - product.price / product.original_price) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    const ok = await addItem(product.id);
    if (ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const getBadgeClass = (badge) => {
    if (!badge) return '';
    if (badge === 'Best Seller') return 'badge-best-seller';
    if (badge === "Amazon's Choice") return 'badge-amazons-choice';
    return 'badge-deal';
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <Link to={`/product/${product.id}`} className="card-link">
        {product.badge && (
          <span className={`badge ${getBadgeClass(product.badge)}`}>{product.badge}</span>
        )}
        <div className="card-image-wrapper">
          <img
            src={product.image_url}
            alt={product.name}
            className="card-image"
            loading="lazy"
          />
        </div>
        <div className="card-body">
          <h3 className="card-title">{product.name}</h3>
          <div className="card-rating">
            <StarRating rating={product.rating} />
            <span className="rating-count">({Number(product.review_count).toLocaleString()})</span>
          </div>
          <div className="price-block">
            <span className="price-symbol">₹</span>
            <span className="price-current">{Number(product.price).toLocaleString('en-IN')}</span>
            {discount > 0 && (
              <>
                <span className="price-original">₹{Number(product.original_price).toLocaleString('en-IN')}</span>
                <span className="price-discount">({discount}% off)</span>
              </>
            )}
          </div>
        </div>
      </Link>
      <button
        className={`btn-add-to-cart ${added ? 'added' : ''}`}
        onClick={handleAddToCart}
        id={`add-cart-${product.id}`}
        disabled={added}
      >
        {added ? '✓ Added to Cart' : 'Add to Cart'}
      </button>
    </div>
  );
}
