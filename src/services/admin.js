import apiRequest from './api';

const adminRequest = (endpoint, options = {}) =>
	apiRequest(endpoint, { ...options, admin: true });

export const getAdminUsers = () => adminRequest('/admin/users');
export const updateUserStatus = (userId, status) =>
	adminRequest(`/admin/users/${userId}`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
	});

export const getAdminStores = () => adminRequest('/admin/stores');
export const updateStoreStatus = (storeId, status) =>
	adminRequest(`/admin/stores/${storeId}`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
	});

export const getAdminProducts = () => adminRequest('/admin/products');
export const deleteAdminProduct = (productId) =>
	adminRequest(`/admin/products/${productId}`, { method: 'DELETE' });

export const getAdminCategories = () => adminRequest('/admin/categories');
export const createCategory = (formData) =>
	adminRequest('/admin/categories', {
		method: 'POST',
		body: formData,
	});
export const updateCategory = (categoryId, formData) =>
	adminRequest(`/admin/categories/${categoryId}`, {
		method: 'PUT',
		body: formData,
	});
export const deleteCategory = (categoryId) =>
	adminRequest(`/admin/categories/${categoryId}`, { method: 'DELETE' });

export const getAdminIdentityVerifications = () =>
	adminRequest('/admin/identity-verifications');
export const verifyIdentity = (verificationId, status) =>
	adminRequest(`/admin/identity-verifications/${verificationId}`, {
		method: 'PATCH',
		body: JSON.stringify({ status }),
	});

export const getAdminAnalytics = () => adminRequest('/admin/analytics');

export const getAdminPromotions = () => adminRequest('/admin/promotions');
export const createPromotion = (data) =>
	adminRequest('/admin/promotions', {
		method: 'POST',
		body: JSON.stringify(data),
	});
export const updatePromotion = (promotionId, data) =>
	adminRequest(`/admin/promotions/${promotionId}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
export const deletePromotion = (promotionId) =>
	adminRequest(`/admin/promotions/${promotionId}`, { method: 'DELETE' });
