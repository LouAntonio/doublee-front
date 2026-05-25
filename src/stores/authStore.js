import { create } from 'zustand';
import { validateSession, loginAdmin } from '../services/auth';
import { notyf } from '../utils/notyf';

const getStoredUser = () => {
	try {
		const saved = localStorage.getItem('doublee_user');
		return saved ? JSON.parse(saved) : null;
	} catch {
		return null;
	}
};

const getStoredAdmin = () => {
	try {
		const saved = localStorage.getItem('doublee_admin');
		return saved ? JSON.parse(saved) : null;
	} catch {
		return null;
	}
};

const isTokenExpired = (token) => {
	try {
		const payload = JSON.parse(atob(token.split('.')[1]));
		return payload.exp * 1000 < Date.now();
	} catch {
		return true;
	}
};

const useAuthStore = create((set, get) => ({
	user: getStoredUser(),
	admin: getStoredAdmin(),
	isLoading: true,
	isAuthenticated: !!getStoredUser(),
	isAdmin: !!getStoredAdmin(),

	initSession: async () => {
		const token = localStorage.getItem('doublee_token');
		if (!token) {
			set({ isLoading: false, user: null, isAuthenticated: false });
			return;
		}
		try {
			const res = await validateSession();
			if (!res || res.success === false) {
				localStorage.removeItem('doublee_user');
				localStorage.removeItem('doublee_token');
				set({ user: null, isAuthenticated: false, isLoading: false });
				return;
			}
		} catch {
			localStorage.removeItem('doublee_user');
			localStorage.removeItem('doublee_token');
			set({ user: null, isAuthenticated: false, isLoading: false });
			return;
		}
		set({ isLoading: false });
	},

	login: (userData, token) => {
		localStorage.setItem('doublee_user', JSON.stringify(userData));
		if (token) localStorage.setItem('doublee_token', token);
		set({ user: userData, isAuthenticated: true, isLoading: false });
	},

	logout: () => {
		localStorage.removeItem('doublee_user');
		localStorage.removeItem('doublee_token');
		set({ user: null, isAuthenticated: false });
	},

	adminLogin: async (email, password) => {
		set({ isLoading: true });
		try {
			const res = await loginAdmin(email, password);
			if (res.success && res.token && res.user) {
				localStorage.setItem('doublee_admin_token', res.token);
				localStorage.setItem('doublee_admin', JSON.stringify(res.user));
				set({ admin: res.user, isAdmin: true, isLoading: false });
				return { success: true };
			}
			set({ isLoading: false });
			return { success: false, msg: res.msg || 'Erro ao realizar login.' };
		} catch (err) {
			set({ isLoading: false });
			return { success: false, msg: err.response?.data?.msg || err.message || 'Erro ao realizar login.' };
		}
	},

	adminLogout: () => {
		localStorage.removeItem('doublee_admin_token');
		localStorage.removeItem('doublee_admin');
		set({ admin: null, isAdmin: false });
		notyf.success('Sessão terminada.');
	},

	initAdmin: () => {
		const storedToken = localStorage.getItem('doublee_admin_token');
		const storedAdmin = getStoredAdmin();
		if (storedToken && storedAdmin) {
			if (isTokenExpired(storedToken)) {
				localStorage.removeItem('doublee_admin_token');
				localStorage.removeItem('doublee_admin');
				set({ admin: null, isAdmin: false, isLoading: false });
				return;
			}
			set({ admin: storedAdmin, isAdmin: true, isLoading: false });
		} else {
			set({ isLoading: false });
		}
	},
}));

export default useAuthStore;
