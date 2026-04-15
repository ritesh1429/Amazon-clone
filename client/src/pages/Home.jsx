import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '../services/api';
import './Home.css';

const HERO_SLIDES = [
  { bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', title: '🔌 Electronics Sale', subtitle: 'Up to 40% off on top brands', cta: 'Shop Electronics', category: 'Electronics' },
  { bg: 'linear-gradient(135deg, #2d1b69 0%, #11998e 100%)', title: '📚 Books for Every Reader', subtitle: 'Bestsellers starting at ₹199', cta: 'Explore Books', category: 'Books' },
  { bg: 'linear-gradient(135deg, #d4145a 0%, #fbb03b 100%)', title: '🏠 Home & Kitchen Deals', subtitle: 'Transform your living space', cta: 'Shop Now', category: 'Home & Kitchen' },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const selectedCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    fetchCategories().then(r => setCategories(r.data.data || [])).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (searchQuery) params.search = searchQuery;
    fetchProducts(params)
      .then(r => setProducts(r.data.data || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[heroIndex];

  return (
    <main className="home-page">
      {/* Hero Banner */}
      {!searchQuery && selectedCategory === 'all' && (
        <section className="hero-section" style={{ background: slide.bg }}>
          <div className="hero-content">
            <h1 className="hero-title">{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <a href={`/?category=${encodeURIComponent(slide.category)}`} className="hero-cta btn-orange">
              {slide.cta} →
            </a>
          </div>
          <div className="hero-dots">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} className={`hero-dot ${i === heroIndex ? 'active' : ''}`} onClick={() => setHeroIndex(i)} />
            ))}
          </div>
        </section>
      )}

      <div className="container">
        {/* Category Tabs */}
        <section className="categories-section">
          <div className="category-tabs">
            <a href="/" className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`} id="cat-all">
              🛍️ All
            </a>
            {categories.map(cat => (
              <a
                key={cat.id}
                href={`/?category=${encodeURIComponent(cat.name)}`}
                className={`category-tab ${selectedCategory === cat.name ? 'active' : ''}`}
                id={`cat-${cat.id}`}
              >
                {cat.icon} {cat.name}
              </a>
            ))}
          </div>
        </section>

        {/* Products Header */}
        <div className="products-header">
          <h2 className="section-title">
            {searchQuery
              ? `Search results for "${searchQuery}"`
              : selectedCategory !== 'all'
              ? `${selectedCategory}`
              : 'Featured Products'}
          </h2>
          <span className="results-count">{products.length} results</span>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="spinner-container"><div className="spinner" /></div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>No products found</h3>
            <p>Try adjusting your search or browse a different category</p>
            <a href="/" className="btn-primary">Browse All Products</a>
          </div>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
