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

	const [isLoading, setIsLoading] = useState(true);

	// Validate session cookie on mount
	useEffect(() => {
		const validateSession = async () => {
			try {
				const data = await apiRequest('/users/is-logged-in', { method: 'GET' });

				if (!data.success) {
					// Cookie is invalid or expired
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

	const login = (userData) => {
		setUser(userData);
		localStorage.setItem('doublee_user', JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem('doublee_user');
	};

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
