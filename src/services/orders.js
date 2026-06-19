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

export const submitPaymentProof = (orderId, data) =>
	http.post(`/orders/${orderId}/payment-proof`, data);

export const getAdminOrders = (params) =>
	http.post('/admin/orders', params, { admin: true });

export const getAdminOrderById = (id) =>
	http.get(`/admin/orders/${id}`, { admin: true });

export const adminConfirmPayment = (orderId) =>
	http.patch(`/admin/orders/${orderId}/confirm-payment`, {}, { admin: true });

export const adminRejectPayment = (orderId, reason) =>
	http.patch(`/admin/orders/${orderId}/reject-payment`, { reason }, { admin: true });
