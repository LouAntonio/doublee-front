import { createContext, useContext, useState, useEffect } from 'react';
import apiRequest, { notyf } from '../services/api';

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
	const [admin, setAdmin] = useState(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const initAuth = async () => {
			const storedToken = localStorage.getItem('doublee_admin_token');
			const storedAdminDate = localStorage.getItem('doublee_admin');

			if (storedToken && storedAdminDate) {
				try {
					const adminData = JSON.parse(storedAdminDate);
					setAdmin(adminData);
					setIsAuthenticated(true);
					// We'll trust the token initially, or if necessary we could add an API endpoint in the backend to verify the admin token.
				} catch (error) {
					console.error('Failed to parse stored admin info', error);
					logout();
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

export const useAdminAuth = () => useContext(AdminAuthContext);
