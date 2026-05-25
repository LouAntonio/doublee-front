import apiRequest from './api';

export const getProducts = (params = {}) => {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			if (Array.isArray(value)) searchParams.set(key, value.join(','));
			else searchParams.set(key, value);
		}
	});
	const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
	return apiRequest(`/products${query}`);
};

export const getProduct = (id) => apiRequest(`/products/${id}`);

export const getFeaturedProducts = () => apiRequest('/products/featured');

export const getBestSellers = () => apiRequest('/products/best-sellers');

export const getLatestProducts = () => apiRequest('/products/latest');

export const getPromotions = () => apiRequest('/products/promotions');

export const getRelatedProducts = (productId, limit = 8) =>
	apiRequest(`/products/${productId}/related?limit=${limit}`);

export const getOnSaleProducts = (limit = 8) =>
	apiRequest(`/products/on-sale?limit=${limit}`);
