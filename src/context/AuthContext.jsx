import React, { createContext, useContext, useState, useEffect } from 'react';
import apiRequest from '../services/api';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(() => {
		const savedUser = localStorage.getItem('doublee_user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const [token, setToken] = useState(() => {
		return localStorage.getItem('doublee_token') || null;
	});

	const [isLoading, setIsLoading] = useState(true);

	// Validate token on mount
	useEffect(() => {
		const validateSession = async () => {
			if (!token) {
				setIsLoading(false);
				return;
			}

			try {
				const data = await apiRequest('/users/is-logged-in', { method: 'GET' });

				if (!data.success) {
					// Token is invalid or expired
					logout();
				}
			} catch {
				logout();
			} finally {
				setIsLoading(false);
			}
		};

		validateSession();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const login = (newToken, userData) => {
		setToken(newToken);
		setUser(userData);
		localStorage.setItem('doublee_token', newToken);
		localStorage.setItem('doublee_user', JSON.stringify(userData));
	};

	const logout = () => {
		setToken(null);
		setUser(null);
		localStorage.removeItem('doublee_token');
		localStorage.removeItem('doublee_user');
	};

	const isAuthenticated = !!user && !!token;

	const value = {
		user,
		token,
		isAuthenticated,
		isLoading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
