import apiRequest from './api';

export const getStores = (params = {}) => {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			searchParams.set(key, value);
		}
	});
	const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
	return apiRequest(`/stores${query}`);
};

export const getStore = (id) => apiRequest(`/stores/${id}`);

export const getFeaturedStores = () => apiRequest('/stores/featured');

export const getStoreProducts = (storeId, params = {}) => {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			searchParams.set(key, value);
		}
	});
	const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
	return apiRequest(`/stores/${storeId}/products${query}`);
};

export const getStoreDashboard = (storeId) =>
	apiRequest(`/stores/${storeId}/dashboard`);

export const createStore = (data) =>
	apiRequest('/stores', {
		method: 'POST',
		body: data instanceof FormData ? data : JSON.stringify(data),
	});

export const updateStore = (storeId, data) =>
	apiRequest(`/stores/${storeId}`, {
		method: 'PUT',
		body: data instanceof FormData ? data : JSON.stringify(data),
	});
