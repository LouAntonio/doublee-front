import apiRequest from './api';

export const getStorePromotions = (storeId) =>
	apiRequest(`/stores/${storeId}/promotions`);

export const createStorePromotion = (storeId, data) =>
	apiRequest(`/stores/${storeId}/promotions`, {
		method: 'POST',
		body: JSON.stringify(data),
	});

export const updateStorePromotion = (storeId, promotionId, data) =>
	apiRequest(`/stores/${storeId}/promotions/${promotionId}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	});

export const deleteStorePromotion = (storeId, promotionId) =>
	apiRequest(`/stores/${storeId}/promotions/${promotionId}`, { method: 'DELETE' });
