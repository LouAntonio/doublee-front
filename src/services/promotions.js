import http from './http';

export const getStorePromotions = (storeId) =>
	http.get(`/stores/${storeId}/promotions`);

export const createStorePromotion = (storeId, data) =>
	http.post(`/stores/${storeId}/promotions`, data);

export const updateStorePromotion = (storeId, promotionId, data) =>
	http.put(`/stores/${storeId}/promotions/${promotionId}`, data);

export const deleteStorePromotion = (storeId, promotionId) =>
	http.delete(`/stores/${storeId}/promotions/${promotionId}`);
