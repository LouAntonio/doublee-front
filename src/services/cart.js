import http from './http';

export const getCart = () => http.get('/cart');

export const addToCartApi = (productId, quantity = 1, variantId = null) =>
	http.post('/cart', { productId, quantity, variantId });

export const removeFromCartApi = (itemId) =>
	http.delete(`/cart/${itemId}`);

export const updateCartItem = (itemId, quantity) =>
	http.patch(`/cart/${itemId}`, { quantity });

export const clearCartApi = () =>
	http.delete('/cart');

export const applyCoupon = (code) =>
	http.post('/cart/coupon', { code });
