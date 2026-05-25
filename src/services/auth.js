import apiRequest from './api';

export const loginUser = (email, password) =>
	apiRequest('/users/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
	});

export const checkEmail = (email) =>
	apiRequest('/users/check-email', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});

export const verifyOtp = (email, code) =>
	apiRequest('/users/verify-otp', {
		method: 'POST',
		body: JSON.stringify({ email, code }),
	});

export const resendOtp = (email) =>
	apiRequest('/users/resend-otp', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});

export const completeRegistration = (data) =>
	apiRequest('/users/complete-registration', {
		method: 'POST',
		body: JSON.stringify(data),
	});

export const validateSession = () =>
	apiRequest('/users/is-logged-in', { method: 'GET' });

export const loginAdmin = (email, password) =>
	apiRequest('/users/admin/login', {
		method: 'POST',
		body: JSON.stringify({ email, password }),
		admin: true,
	});

export const requestPasswordReset = (email) =>
	apiRequest('/users/request-password-reset', {
		method: 'POST',
		body: JSON.stringify({ email }),
	});

export const resetPassword = (email, code, newPassword) =>
	apiRequest('/users/reset-password', {
		method: 'POST',
		body: JSON.stringify({ email, code, newPassword }),
	});

export const googleAuth = (credential) =>
	apiRequest('/auth/google', {
		method: 'POST',
		body: JSON.stringify({ credential }),
	});
