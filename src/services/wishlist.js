import http from './http';

export const getWishlist = (page = 1, limit = 50) =>
	http.get(`/wishlist?page=${page}&limit=${limit}`);

export const checkWishlist = (productId) =>
	http.get(`/wishlist/check/${productId}`);

export const toggleWishlistApi = (productId) =>
	http.post('/wishlist/toggle', { productId });
