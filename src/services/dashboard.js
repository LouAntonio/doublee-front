import apiRequest from './api';

export const getStoreDashboardData = () => apiRequest('/dashboard');

export const getStoreProfile = () => apiRequest('/dashboard/profile');

export const updateStoreProfile = (data) =>
	apiRequest('/dashboard/profile', {
		method: 'PUT',
		body: data instanceof FormData ? data : JSON.stringify(data),
	});

export const getStoreAccount = () => apiRequest('/dashboard/account');

export const updateStoreAccount = (data) =>
	apiRequest('/dashboard/account', {
		method: 'PUT',
		body: JSON.stringify(data),
	});

export const submitIdentityVerification = (formData) =>
	apiRequest('/dashboard/identity', {
		method: 'POST',
		body: formData,
	});

export const getIdentityVerificationStatus = () =>
	apiRequest('/dashboard/identity');
