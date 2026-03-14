import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import apiRequest from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = () => {
	const context = useContext(WishlistContext);
	if (!context) {
		throw new Error('useWishlist must be used within a WishlistProvider');
	}
	return context;
};

export const WishlistProvider = ({ children }) => {
	const [wishlistItems, setWishlistItems] = useState([]);
	const [wishlistIds, setWishlistIds] = useState(() => new Set());
	const [isLoading, setIsLoading] = useState(false);
	const [togglingIds, setTogglingIds] = useState([]);
	const { isAuthenticated } = useAuth();

	const hasToken = useCallback(() => Boolean(localStorage.getItem('doublee_token')), []);

	const setToggleLoading = useCallback((productId, isToggling) => {
		setTogglingIds((prev) => {
			const exists = prev.includes(productId);
			if (isToggling) {
				return exists ? prev : [...prev, productId];
			}
			return exists ? prev.filter((id) => id !== productId) : prev;
		});
	}, []);

	const isToggling = useCallback(
		(productId) => togglingIds.includes(productId),
		[togglingIds]
	);

	const rebuildIds = useCallback((items) => {
		const next = new Set();
		items.forEach((item) => {
			const productId = item.productId ?? item.product?.id;
			if (productId) next.add(productId);
		});
		setWishlistIds(next);
	}, []);

	const loadWishlist = useCallback(async ({ page = 1, limit = 50 } = {}) => {
		if (!isAuthenticated || !hasToken()) {
			setWishlistItems([]);
			setWishlistIds(new Set());
			return { success: false, msg: 'not-authenticated' };
		}

		setIsLoading(true);
		try {
			const res = await apiRequest(`/wishlist?page=${page}&limit=${limit}`, { method: 'GET' });
			if (res && res.success && res.data?.wishlist) {
				const items = Array.isArray(res.data.wishlist) ? res.data.wishlist : [];
				setWishlistItems(items);
				rebuildIds(items);
				return res;
			}
			return res;
		} finally {
			setIsLoading(false);
		}
	}, [hasToken, isAuthenticated, rebuildIds]);

	const checkInWishlist = useCallback(async (productId) => {
		if (!productId || !isAuthenticated || !hasToken()) return false;
		const res = await apiRequest(`/wishlist/check/${productId}`, { method: 'GET' });
		if (res && res.success) {
			const inWishlist = Boolean(res.data?.inWishlist);
			setWishlistIds((prev) => {
				const next = new Set(prev);
				if (inWishlist) next.add(productId);
				else next.delete(productId);
				return next;
			});
			return inWishlist;
		}
		return false;
	}, [hasToken, isAuthenticated]);

	const addItemIfMissing = useCallback((product) => {
		if (!product?.id) return;
		setWishlistItems((prev) => {
			const exists = prev.some((item) => item.productId === product.id || item.product?.id === product.id);
			if (exists) return prev;
			return [
				{
					id: `local-${product.id}`,
					productId: product.id,
					product: {
						id: product.id,
						name: product.name ?? product.title ?? '',
						price: product.price ?? 0,
						promotionalPrice: product.promotionalPrice,
						image: product.image,
						stock: product.stock,
						store: product.store,
						rating: product.rating,
						qtdRatings: product.reviewCount ?? product.qtdRatings
					}
				},
				...prev
			];
		});
	}, []);

	const removeItem = useCallback((productId) => {
		if (!productId) return;
		setWishlistItems((prev) => prev.filter((item) => (item.productId ?? item.product?.id) !== productId));
	}, []);

	const toggleWishlist = useCallback(async (product) => {
		const productId = product?.id ?? product;
		if (!productId || !isAuthenticated || !hasToken()) {
			return { success: false, msg: 'not-authenticated', inWishlist: false };
		}

		setToggleLoading(productId, true);
		try {
			const res = await apiRequest('/wishlist/toggle', {
				method: 'POST',
				body: JSON.stringify({ productId })
			});

			if (res && res.success) {
				const inWishlist = Boolean(res.data?.inWishlist);
				setWishlistIds((prev) => {
					const next = new Set(prev);
					if (inWishlist) next.add(productId);
					else next.delete(productId);
					return next;
				});

				if (inWishlist) {
					addItemIfMissing(product);
				} else {
					removeItem(productId);
				}
				return { success: true, msg: res.msg, inWishlist };
			}

			return { success: false, msg: res?.msg || 'Erro ao atualizar wishlist.', inWishlist: false };
		} finally {
			setToggleLoading(productId, false);
		}
	}, [addItemIfMissing, hasToken, isAuthenticated, removeItem, setToggleLoading]);

	const isWishlisted = useCallback((productId) => wishlistIds.has(productId), [wishlistIds]);

	useEffect(() => {
		if (!isAuthenticated || !hasToken()) {
			setWishlistItems([]);
			setWishlistIds(new Set());
		}
	}, [hasToken, isAuthenticated]);

	const value = useMemo(() => ({
		wishlistItems,
		isLoading,
		loadWishlist,
		checkInWishlist,
		toggleWishlist,
		isWishlisted,
		isToggling,
	}), [wishlistItems, isLoading, loadWishlist, checkInWishlist, toggleWishlist, isWishlisted, isToggling]);

	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
