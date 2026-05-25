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

export const getOrders = () => http.get('/orders');

export const getStoreOrders = (storeId, params = {}) =>
	http.get(`/stores/${storeId}/orders${buildQuery(params)}`);

export const updateOrderStatus = (storeId, orderId, status) =>
	http.patch(`/stores/${storeId}/orders/${orderId}`, { status });

export const createOrder = (data) =>
	http.post('/orders', data);
