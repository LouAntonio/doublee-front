import apiRequest from './api';

export const getWishlist = (page = 1, limit = 50) =>
	apiRequest(`/wishlist?page=${page}&limit=${limit}`);

export const checkWishlist = (productId) =>
	apiRequest(`/wishlist/check/${productId}`);

export const toggleWishlistApi = (productId) =>
	apiRequest('/wishlist/toggle', {
		method: 'POST',
		body: JSON.stringify({ productId }),
	});
