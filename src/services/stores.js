import http from './http';

const buildQuery = (params) => {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			searchParams.set(key, value);
		}
	});
	const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
	return query;
};

export const getStores = (params = {}) => http.get(`/stores${buildQuery(params)}`);

export const getStore = (id) => http.get(`/stores/${id}`);

export const getFeaturedStores = () => http.get('/stores/featured');

export const getStoreProducts = (storeId, params = {}) =>
	http.get(`/stores/${storeId}/products${buildQuery(params)}`);

export const getStoreDashboard = (storeId) =>
	http.get(`/stores/${storeId}/dashboard`);

export const createStore = (data) =>
	http.post('/stores', data);

export const updateStore = (storeId, data) =>
	http.put(`/stores/${storeId}`, data);
