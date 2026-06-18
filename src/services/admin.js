import http from './http';

const adminGet = (url) => http.get(url, { admin: true });
const adminPost = (url, data) => http.post(url, data, { admin: true });
const adminPut = (url, data) => http.put(url, data, { admin: true });
const adminPatch = (url, data) => http.patch(url, data, { admin: true });
const adminDelete = (url) => http.delete(url, { admin: true });

export const getAdminUsers = () => adminGet('/admin/users');

export const updateUserStatus = (userId, status) =>
	adminPatch(`/admin/users/${userId}`, { status });

export const getAdminStores = () => adminGet('/admin/stores');

export const updateStoreStatus = (storeId, status) =>
	adminPatch(`/admin/stores/${storeId}`, { status });

export const getAdminProducts = () => adminGet('/admin/products');

export const deleteAdminProduct = (productId) =>
	adminDelete(`/admin/products/${productId}`);

export const getAdminCategories = () => adminGet('/admin/categories');

export const createCategory = (formData) =>
	adminPost('/admin/categories', formData);

export const updateCategory = (categoryId, formData) =>
	adminPut(`/admin/categories/${categoryId}`, formData);

export const deleteCategory = (categoryId) =>
	adminDelete(`/admin/categories/${categoryId}`);

export const getAdminIdentityVerifications = () =>
	adminGet('/admin/identity-verifications');

export const verifyIdentity = (verificationId, status) =>
	adminPatch(`/admin/identity-verifications/${verificationId}`, { status });

export const getAdminAnalytics = () => adminGet('/admin/analytics');

export const getAdminPromotions = () => adminGet('/admin/promotions');

export const createPromotion = (data) =>
	adminPost('/admin/promotions', data);

export const updatePromotion = (promotionId, data) =>
	adminPut(`/admin/promotions/${promotionId}`, data);

export const deletePromotion = (promotionId) =>
	adminDelete(`/admin/promotions/${promotionId}`);

// ─── Delivery Zones ──────────────────────────────────────────

export const getAdminDeliveryZones = () => adminGet('/admin/delivery-zones');

export const createDeliveryZone = (data) =>
	adminPost('/admin/delivery-zones', data);

export const updateDeliveryZone = (id, data) =>
	adminPut(`/admin/delivery-zones/${id}`, data);

export const deleteDeliveryZone = (id) =>
	adminDelete(`/admin/delivery-zones/${id}`);
