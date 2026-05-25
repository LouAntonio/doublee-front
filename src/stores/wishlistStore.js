import { create } from 'zustand';
import { getWishlist, checkWishlist, toggleWishlistApi } from '../services/wishlist';

const useWishlistStore = create((set, get) => ({
	wishlistItems: [],
	wishlistIds: new Set(),
	isLoading: false,
	togglingIds: [],

	setToggleLoading: (productId, isToggling) => {
		set((state) => {
			const exists = state.togglingIds.includes(productId);
			if (isToggling) {
				return exists ? state : { togglingIds: [...state.togglingIds, productId] };
			}
			return exists
				? { togglingIds: state.togglingIds.filter((id) => id !== productId) }
				: state;
		});
	},

	isToggling: (productId) => get().togglingIds.includes(productId),

	rebuildIds: (items) => {
		const next = new Set();
		items.forEach((item) => {
			const productId = item.productId ?? item.product?.id;
			if (productId) next.add(productId);
		});
		set({ wishlistIds: next });
	},

	loadWishlist: async ({ page = 1, limit = 50 } = {}) => {
		const isAuthenticated = !!localStorage.getItem('doublee_token');
		if (!isAuthenticated) {
			set({ wishlistItems: [], wishlistIds: new Set() });
			return { success: false, msg: 'not-authenticated' };
		}

		set({ isLoading: true });
		try {
			const res = await getWishlist(page, limit);
			if (res?.success && res.data?.wishlist) {
				const items = Array.isArray(res.data.wishlist) ? res.data.wishlist : [];
				set({ wishlistItems: items });
				get().rebuildIds(items);
				return res;
			}
			return res || { success: false };
		} catch {
			return { success: false };
		} finally {
			set({ isLoading: false });
		}
	},

	checkInWishlist: async (productId) => {
		if (!productId) return false;
		const isAuthenticated = !!localStorage.getItem('doublee_token');
		if (!isAuthenticated) return false;

		try {
			const res = await checkWishlist(productId);
			if (res?.success) {
				const inWishlist = Boolean(res.data?.inWishlist);
				set((state) => {
					const next = new Set(state.wishlistIds);
					if (inWishlist) next.add(productId);
					else next.delete(productId);
					return { wishlistIds: next };
				});
				return inWishlist;
			}
		} catch {
			// ignore
		}
		return false;
	},

	addItemIfMissing: (product) => {
		if (!product?.id) return;
		set((state) => {
			const exists = state.wishlistItems.some(
				(item) => item.productId === product.id || item.product?.id === product.id
			);
			if (exists) return state;
			return {
				wishlistItems: [
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
							qtdRatings: product.reviewCount ?? product.qtdRatings,
						},
					},
					...state.wishlistItems,
				],
			};
		});
	},

	removeItem: (productId) => {
		if (!productId) return;
		set((state) => ({
			wishlistItems: state.wishlistItems.filter(
				(item) => (item.productId ?? item.product?.id) !== productId
			),
		}));
	},

	toggleWishlist: async (product) => {
		const productId = product?.id ?? product;
		const isAuthenticated = !!localStorage.getItem('doublee_token');
		if (!productId || !isAuthenticated) {
			return { success: false, msg: 'not-authenticated', inWishlist: false };
		}

		get().setToggleLoading(productId, true);
		try {
			const res = await toggleWishlistApi(productId);
			if (res?.success) {
				const inWishlist = Boolean(res.data?.inWishlist);
				set((state) => {
					const next = new Set(state.wishlistIds);
					if (inWishlist) next.add(productId);
					else next.delete(productId);
					return { wishlistIds: next };
				});

				if (inWishlist) {
					get().addItemIfMissing(product);
				} else {
					get().removeItem(productId);
				}
				return { success: true, msg: res.msg, inWishlist };
			}
			return { success: false, msg: res?.msg || 'Erro ao atualizar wishlist.', inWishlist: false };
		} catch (err) {
			return { success: false, msg: err.message || 'Erro ao atualizar wishlist.', inWishlist: false };
		} finally {
			get().setToggleLoading(productId, false);
		}
	},

	isWishlisted: (productId) => get().wishlistIds.has(productId),

	reset: () => {
		set({ wishlistItems: [], wishlistIds: new Set() });
	},
}));

export default useWishlistStore;
