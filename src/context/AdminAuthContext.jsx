import { createContext, useContext, useState, useEffect } from 'react';
import apiRequest, { notyf } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
	const [admin, setAdmin] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const isTokenExpired = (token) => {
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			return payload.exp * 1000 < Date.now();
		} catch {
			return true; // token inválido, tratar como expirado
		}
	};

	useEffect(() => {
		const initAuth = async () => {
			const storedToken = localStorage.getItem('doublee_admin_token');
			const storedAdminDate = localStorage.getItem('doublee_admin');

			if (storedToken && storedAdminDate) {
				// Verificar se o token já expirou antes de confiar nele
				if (isTokenExpired(storedToken)) {
					localStorage.removeItem('doublee_admin_token');
					localStorage.removeItem('doublee_admin');
					setIsLoading(false);
					return;
				}

				try {
					const adminData = JSON.parse(storedAdminDate);
					setAdmin(adminData);
					setIsAuthenticated(true);
				} catch (error) {
					console.error('Failed to parse stored admin info', error);
					localStorage.removeItem('doublee_admin_token');
					localStorage.removeItem('doublee_admin');
				}
			}
			setIsLoading(false);
		};
		initAuth();
	}, []);

	const login = async (email, password) => {
		setIsLoading(true);
		try {
			const response = await apiRequest('/users/admin/login', {
				method: 'POST',
				body: JSON.stringify({ email, password }),
			});

			if (response.success && response.token && response.user) {
				localStorage.setItem('doublee_admin_token', response.token);
				localStorage.setItem('doublee_admin', JSON.stringify(response.user));
				setAdmin(response.user);
				setIsAuthenticated(true);
				return { success: true };
			} else {
				return { success: false, msg: response.msg || 'Erro ao realizar login.' };
			}
		} catch (error) {
			console.log('Login error:', error);
			return { success: false, msg: 'Erro de conexão com o servidor.' };
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		localStorage.removeItem('doublee_admin_token');
		localStorage.removeItem('doublee_admin');
		setAdmin(null);
		setIsAuthenticated(false);
		notyf.success('Sessão terminada.');
	};

	return (
		<AdminAuthContext.Provider value={{
			admin,
			isAuthenticated,
			isLoading,
			login,
			logout
		}}>
			{children}
		</AdminAuthContext.Provider>
	);
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminAuth = () => useContext(AdminAuthContext);
