import http from './http';

export const getStoreDashboardData = () => http.get('/dashboard');

export const getStoreProfile = () => http.get('/dashboard/profile');

export const updateStoreProfile = (data) =>
	http.put('/dashboard/profile', data);

export const getStoreAccount = () => http.get('/dashboard/account');

export const updateStoreAccount = (data) =>
	http.put('/dashboard/account', data);

export const submitIdentityVerification = (formData) =>
	http.post('/dashboard/identity', formData);

export const getIdentityVerificationStatus = () =>
	http.get('/dashboard/identity');
