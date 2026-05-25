import http from './http';

export const getCoupons = () => http.get('/coupons');

export const getPublicCoupons = () => http.get('/coupons/public');

export const getStoreCoupons = (storeId) =>
	http.get(`/stores/${storeId}/coupons`);

export const createCoupon = (storeId, data) =>
	http.post(`/stores/${storeId}/coupons`, data);

export const updateCoupon = (storeId, couponId, data) =>
	http.put(`/stores/${storeId}/coupons/${couponId}`, data);

export const deleteCoupon = (storeId, couponId) =>
	http.delete(`/stores/${storeId}/coupons/${couponId}`);
