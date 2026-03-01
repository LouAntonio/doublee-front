import React, { createContext, useContext, useState, useEffect } from 'react';

import { notyf } from '../utils/notyf';

const CartContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
	const context = useContext(CartContext);
	if (!context) {
		throw new Error('useCart must be used within a CartProvider');
	}
	return context;
};

export const CartProvider = ({ children }) => {
	const [cartItems, setCartItems] = useState(() => {
		// Load cart from localStorage on initialization
		const savedCart = localStorage.getItem('cart');
		return savedCart ? JSON.parse(savedCart) : [];
	});

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cartItems));
	}, [cartItems]);

	const addToCart = (product, quantity = 1, showNotification = true) => {
		setCartItems((prevItems) => {
			const existingItem = prevItems.find((item) => item.id === product.id);

			if (existingItem) {
				// If item exists, increase quantity
				return prevItems.map((item) =>
					item.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			} else {
				// Add new item with quantity
				return [...prevItems, { ...product, quantity }];
			}
		});
		if (showNotification) {
			notyf.success('Produto adicionado ao carrinho!');
		}
	};

	const removeFromCart = (productId) => {
		setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
		notyf.error('Produto removido do carrinho');
	};

	const updateQuantity = (productId, quantity) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}

		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === productId ? { ...item, quantity } : item
			)
		);
	};

	const clearCart = () => {
		setCartItems([]);
	};

	const getCartTotal = () => {
		return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
	};

	const getCartCount = () => {
		return cartItems.reduce((count, item) => count + item.quantity, 0);
	};

	const getSubtotal = () => {
		return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
	};

	const getShipping = () => {
		// Free shipping for orders over R$ 200
		const subtotal = getSubtotal();
		return subtotal >= 200 ? 0 : 15;
	};

	const getTax = () => {
		// 10% tax
		return getSubtotal() * 0.1;
	};

	const getTotal = () => {
		return getSubtotal() + getShipping() + getTax();
	};

	const value = {
		cartItems,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		getCartTotal,
		getCartCount,
		getSubtotal,
		getShipping,
		getTax,
		getTotal,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
