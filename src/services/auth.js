import http from './http';

export const loginUser = (email, password) =>
	http.post('/users/login', { email, password });

export const checkEmail = (email) =>
	http.post('/users/check-email', { email });

export const verifyOtp = (email, code) =>
	http.post('/users/verify-otp', { email, code });

export const resendOtp = (email) =>
	http.post('/users/resend-otp', { email });

export const completeRegistration = (data) =>
	http.post('/users/complete-registration', data);

export const validateSession = () =>
	http.get('/users/is-logged-in');

export const loginAdmin = (email, password) =>
	http.post('/users/admin/login', { email, password }, { admin: true });

export const requestPasswordReset = (email) =>
	http.post('/users/request-password-reset', { email });

export const resetPassword = (email, code, newPassword) =>
	http.post('/users/reset-password', { email, code, newPassword });

export const googleAuth = (credential) =>
	http.post('/auth/google', { credential });

export const linkGoogle = (credential) =>
	http.post('/auth/google/link', { credential });

export const unlinkGoogle = () =>
	http.post('/auth/google/unlink');
