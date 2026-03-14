import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import apiRequest from '../services/api';
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
	const [addingProductIds, setAddingProductIds] = useState([]);
	const [removingItemIds, setRemovingItemIds] = useState([]);
	const [updatingItemIds, setUpdatingItemIds] = useState([]);

	const hasToken = useCallback(() => Boolean(localStorage.getItem('doublee_token')), []);

	const setProductAdding = useCallback((productId, isAdding) => {
		setAddingProductIds((prev) => {
			const exists = prev.includes(productId);
			if (isAdding) {
				return exists ? prev : [...prev, productId];
			}
			return exists ? prev.filter((id) => id !== productId) : prev;
		});
	}, []);

	const isAddingProduct = useCallback(
		(productId) => addingProductIds.includes(productId),
		[addingProductIds]
	);

	const setItemRemoving = useCallback((itemId, isRemoving) => {
		setRemovingItemIds((prev) => {
			const exists = prev.includes(itemId);
			if (isRemoving) {
				return exists ? prev : [...prev, itemId];
			}
			return exists ? prev.filter((id) => id !== itemId) : prev;
		});
	}, []);

	const isRemovingItem = useCallback(
		(itemId) => removingItemIds.includes(itemId),
		[removingItemIds]
	);

	const setItemUpdating = useCallback((itemId, isUpdating) => {
		setUpdatingItemIds((prev) => {
			const exists = prev.includes(itemId);
			if (isUpdating) {
				return exists ? prev : [...prev, itemId];
			}
			return exists ? prev.filter((id) => id !== itemId) : prev;
		});
	}, []);

	const isUpdatingItem = useCallback(
		(itemId) => updatingItemIds.includes(itemId),
		[updatingItemIds]
	);

	const mapApiItem = useCallback((item) => ({
		id: item.id,
		productId: item.product?.id ?? item.productId,
		name: item.product?.name ?? item.name,
		price: item.product?.promotionalPrice ?? item.product?.price ?? item.price ?? 0,
		image: item.product?.image ?? item.image,
		quantity: item.quantity,
		stock: item.product?.stock ?? item.stock,
		store: item.product?.store ?? item.store,
	}), []);

	const loadCartFromApi = useCallback(async () => {
		if (!hasToken()) return;
		const res = await apiRequest('/cart');
		if (res && res.success && res.data?.cart) {
			const items = Array.isArray(res.data.cart.items)
				? res.data.cart.items.map(mapApiItem)
				: [];
			setCartItems(items);
			return;
		}

		if (res && res.success === false) {
			notyf.error(res.msg || 'Erro ao carregar o carrinho.');
		}
	}, [hasToken, mapApiItem]);

	// Save cart to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem('cart', JSON.stringify(cartItems));
	}, [cartItems]);

	useEffect(() => {
		loadCartFromApi();
	}, [loadCartFromApi]);

	const addToCart = async (product, quantity = 1, showNotification = true) => {
		if (!product?.id) return;
		setProductAdding(product.id, true);
		try {
			if (hasToken()) {
				const res = await apiRequest('/cart', {
					method: 'POST',
					body: JSON.stringify({ productId: product.id, quantity }),
				});
				if (res && res.success) {
					await loadCartFromApi();
					if (showNotification) {
						notyf.success(res.msg || 'Produto adicionado ao carrinho!');
					}
					return;
				}
				notyf.error(res?.msg || 'Nao foi possivel adicionar ao carrinho.');
				return;
			}

			setCartItems((prevItems) => {
				const existingItem = prevItems.find((item) => item.id === product.id);

				if (existingItem) {
					// If item exists, increase quantity
					return prevItems.map((item) =>
						item.id === product.id
							? { ...item, quantity: item.quantity + quantity }
							: item
					);
				}
				// Add new item with quantity
				return [...prevItems, { ...product, quantity }];
			});
			if (showNotification) {
				notyf.success('Produto adicionado ao carrinho!');
			}
		} finally {
			setProductAdding(product.id, false);
		}
	};

	const removeFromCart = async (itemId) => {
		setItemRemoving(itemId, true);
		try {
			if (hasToken()) {
				const res = await apiRequest(`/cart/${itemId}`, { method: 'DELETE' });
				if (res && res.success) {
					await loadCartFromApi();
					notyf.error(res.msg || 'Produto removido do carrinho');
					return;
				}
				notyf.error(res?.msg || 'Nao foi possivel remover do carrinho.');
				return;
			}

			setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
			notyf.error('Produto removido do carrinho');
		} finally {
			setItemRemoving(itemId, false);
		}
	};

	const updateQuantity = async (itemId, quantity) => {
		if (quantity <= 0) {
			await removeFromCart(itemId);
			return;
		}

		if (hasToken()) {
			setItemUpdating(itemId, true);
			try {
				const res = await apiRequest(`/cart/${itemId}`, {
					method: 'PATCH',
					body: JSON.stringify({ quantity }),
				});
				if (res && res.success) {
					await loadCartFromApi();
					return;
				}
				notyf.error(res?.msg || 'Nao foi possivel atualizar a quantidade.');
				return;
			} finally {
				setItemUpdating(itemId, false);
			}
		}

		setCartItems((prevItems) =>
			prevItems.map((item) =>
				item.id === itemId ? { ...item, quantity } : item
			)
		);
	};

	const clearCart = async () => {
		if (hasToken()) {
			const res = await apiRequest('/cart', { method: 'DELETE' });
			if (res && res.success) {
				setCartItems([]);
				return;
			}
			notyf.error(res?.msg || 'Nao foi possivel limpar o carrinho.');
			return;
		}
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
		isAddingProduct,
		isRemovingItem,
		isUpdatingItem,
		getCartTotal,
		getCartCount,
		getSubtotal,
		getShipping,
		getTax,
		getTotal,
	};

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
