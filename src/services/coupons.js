import apiRequest from './api';

export const getCoupons = () => apiRequest('/coupons');

export const getPublicCoupons = () => apiRequest('/coupons/public');

export const getStoreCoupons = (storeId) =>
	apiRequest(`/stores/${storeId}/coupons`);

export const createCoupon = (storeId, data) =>
	apiRequest(`/stores/${storeId}/coupons`, {
		method: 'POST',
		body: JSON.stringify(data),
	});

export const updateCoupon = (storeId, couponId, data) =>
	apiRequest(`/stores/${storeId}/coupons/${couponId}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	});

export const deleteCoupon = (storeId, couponId) =>
	apiRequest(`/stores/${storeId}/coupons/${couponId}`, { method: 'DELETE' });
