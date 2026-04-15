import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

const DEFAULT_USER_ID = 1;

// Products
export const fetchProducts = (params = {}) => API.get('/products', { params });
export const fetchProduct = (id) => API.get(`/products/${id}`);
export const fetchCategories = () => API.get('/products/meta/categories');

// Cart
export const fetchCart = (userId = DEFAULT_USER_ID) => API.get(`/cart/${userId}`);
export const addToCart = (product_id, quantity = 1, user_id = DEFAULT_USER_ID) =>
  API.post('/cart', { user_id, product_id, quantity });
export const updateCartItem = (id, quantity) => API.put(`/cart/${id}`, { quantity });
export const removeCartItem = (id) => API.delete(`/cart/${id}`);

// Orders
export const placeOrder = (address, user_id = DEFAULT_USER_ID) =>
  API.post('/orders', { user_id, address });
export const fetchOrderHistory = (userId = DEFAULT_USER_ID) => API.get(`/orders/user/${userId}`);
export const fetchOrder = (id) => API.get(`/orders/${id}`);
