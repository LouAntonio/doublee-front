import apiRequest from './api';

export const getOrders = () => apiRequest('/orders');

export const getStoreOrders = (storeId, params = {}) => {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null && value !== '') {
			searchParams.set(key, value);
		}
	});
	const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
	return apiRequest(`/stores/${storeId}/orders${query}`);
};

export const updateOrderStatus = (storeId, orderId, status) =>
	apiRequest(`/stores/${storeId}/orders/${orderId}`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
	});

export const createOrder = (data) =>
	apiRequest('/orders', {
		method: 'POST',
		body: JSON.stringify(data),
	});
