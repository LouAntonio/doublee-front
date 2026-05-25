import http from './http';

const buildQuery = (params) => {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			if (Array.isArray(value)) searchParams.set(key, value.join(','));
			else searchParams.set(key, value);
		}
	});
	const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
	return query;
};

export const getProducts = (params = {}) => http.get(`/products${buildQuery(params)}`);

export const getProduct = (id) => http.get(`/products/${id}`);

export const getFeaturedProducts = () => http.get('/products/featured');

export const getBestSellers = () => http.get('/products/best-sellers');

export const getLatestProducts = () => http.get('/products/latest');

export const getPromotions = () => http.get('/products/promotions');

export const getRelatedProducts = (productId, limit = 8) =>
	http.get(`/products/${productId}/related?limit=${limit}`);

export const getOnSaleProducts = (limit = 8) =>
	http.get(`/products/on-sale?limit=${limit}`);

export const createProduct = (data) =>
	http.post('/products', data);

export const updateProduct = (id, data) =>
	http.put(`/products/${id}`, data);

export const deleteProduct = (id) =>
	http.delete(`/products/${id}`);
