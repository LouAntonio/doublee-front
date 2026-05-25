import React, { createContext, useContext, useState, useEffect } from 'react';
import http from '../services/http';

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
		const savedUser = localStorage.getItem('Kusumba_user');
		return savedUser ? JSON.parse(savedUser) : null;
	});

	const [isLoading, setIsLoading] = useState(true);

	const login = (userData, token) => {
		setUser(userData);
		localStorage.setItem('Kusumba_user', JSON.stringify(userData));
		if (token) localStorage.setItem('Kusumba_token', token);
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('Kusumba_user');
		localStorage.removeItem('Kusumba_token');
	};

	// Validate session cookie on mount
	useEffect(() => {
		const validateSession = async () => {
			try {
				const data = await http.get('/users/is-logged-in');

				if (!data?.success) {
					logout();
				}
			} catch {
				logout();
			} finally {
				setIsLoading(false);
			}
		};

		validateSession();
	}, []);

	const isAuthenticated = !!user;

	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		logout,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
