import axios from 'axios';

const apiurl = import.meta.env.VITE_API_URL || 'http://localhost:20262';
export const API_URL = apiurl;

console.log('API URL:', API_URL);

const handleSessionExpired = () => {
	localStorage.removeItem('Kusumba_user');
	localStorage.removeItem('Kusumba_token');
	localStorage.removeItem('cart');
	if (window.location.pathname === '/auth') return;
	setTimeout(() => {
		window.location.href = '/auth';
	}, 500);
};

const handleAdminSessionExpired = () => {
	localStorage.removeItem('Kusumba_admin_token');
	localStorage.removeItem('Kusumba_admin');
	setTimeout(() => {
		window.location.href = '/auth';
	}, 500);
};

const http = axios.create({
	baseURL: API_URL,
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
	const isAdmin = config.admin === true;
	const tokenKey = isAdmin ? 'Kusumba_admin_token' : 'Kusumba_token';
	const token = localStorage.getItem(tokenKey);
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	if (config.data instanceof FormData) {
		delete config.headers['Content-Type'];
	}
	return config;
});

http.interceptors.response.use(
	(response) => {
		const data = response.data;
		if (data && data.success === false && data.auth === true) {
			const isAdmin = response.config.admin === true;
			if (isAdmin) {
				handleAdminSessionExpired();
			} else {
				handleSessionExpired();
			}
			return Promise.reject(new Error('Sessão expirada'));
		}
		return data;
	},
	(error) => {
		const status = error.response?.status;
		const data = error.response?.data;
		if (status === 401) {
			const isAdmin = error.config?.admin === true;
			if (isAdmin) {
				handleAdminSessionExpired();
			} else {
				handleSessionExpired();
			}
			return Promise.reject(new Error('Sessão expirada'));
		}
		if (status === 429) {
			const msg = data?.msg || 'Muitas tentativas. Tente novamente mais tarde.';
			return Promise.reject(new Error(msg));
		}
		if (data?.msg) {
			return Promise.reject(new Error(data.msg));
		}
		console.error('Erro na requisição:', error);
		return Promise.reject(error);
	}
);

export default http;

