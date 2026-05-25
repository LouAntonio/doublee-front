import apiRequest from './api';

export const getCart = () => apiRequest('/cart');

export const addToCartApi = (productId, quantity = 1) =>
	apiRequest('/cart', {
		method: 'POST',
		body: JSON.stringify({ productId, quantity }),
	});

export const removeFromCartApi = (itemId) =>
	apiRequest(`/cart/${itemId}`, { method: 'DELETE' });

export const updateCartItem = (itemId, quantity) =>
	apiRequest(`/cart/${itemId}`, {
		method: 'PATCH',
		body: JSON.stringify({ quantity }),
	});

export const clearCartApi = () =>
	apiRequest('/cart', { method: 'DELETE' });

export const applyCoupon = (code) =>
	apiRequest('/cart/coupon', {
		method: 'POST',
		body: JSON.stringify({ code }),
	});
