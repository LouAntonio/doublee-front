import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart, addToCartApi, removeFromCartApi, updateCartItem, clearCartApi } from '../services/cart';
import { notyf } from '../utils/notyf';

const FALLBACK_IMAGE = '/images/produto.png';

const normalizeCartItem = (item = {}) => {
	const p = item.product ?? {};
	const v = item.variant ?? item.variantOptions ?? null;
	const vOptions = v?.options || v || null;
	const variantEffectivePrice =
		v && (v.promotionalPrice && v.promotionalEndDate && new Date(v.promotionalEndDate) > new Date()
			? Number(v.promotionalPrice)
			: v.price !== null && v.price !== undefined
				? Number(v.price)
				: null);
	const image =
		item.image ??
		v?.image ??
		p.image ??
		(Array.isArray(item.images) ? item.images[0] : null) ??
		(Array.isArray(p.gallery) ? p.gallery[0] : null) ??
		FALLBACK_IMAGE;
	const price = variantEffectivePrice ?? Number(item.price ?? p.price ?? 0);
	const promo = variantEffectivePrice ?? Number(p.promotionalPrice ?? item.promotionalPrice ?? 0);
	const variantId = item.variantId ?? v?.id ?? null;
	const variantKey = item.variantKey ?? (variantId ? variantId : 'default');
	return {
		id: item.id ?? item.productId ?? p.id,
		productId: item.productId ?? item.id ?? p.id,
		key: `${item.productId ?? item.id ?? p.id}:${variantKey}`,
		name: item.name ?? p.name ?? item.title ?? p.title ?? 'Produto',
		price: promo > 0 ? promo : price,
		image,
		quantity: Number(item.quantity) || 1,
		stock: v?.stock ?? item.stock ?? p.stock,
		store: item.store ?? p.store,
		variantId,
		variantKey,
		variantOptions: vOptions && typeof vOptions === 'object' ? vOptions : null,
	};
};

const formatVariantLabel = (item) => {
	if (!item?.variantOptions) return null;
	const values = Object.values(item.variantOptions);
	return values.length ? values.filter(Boolean).join(' / ') : null;
};

const mapApiItem = normalizeCartItem;

const hasToken = () => Boolean(localStorage.getItem('Kusumba_token'));

const useCartStore = create(
	persist(
		(set, get) => ({
			cartItems: [],
			addingProductIds: [],
			removingItemIds: [],
			updatingItemIds: [],
			appliedCoupon: null,

			setProductAdding: (productId, isAdding) => {
				set((state) => {
					const exists = state.addingProductIds.includes(productId);
					if (isAdding) {
						return exists ? state : { addingProductIds: [...state.addingProductIds, productId] };
					}
					return exists
						? { addingProductIds: state.addingProductIds.filter((id) => id !== productId) }
						: state;
				});
			},

			setItemRemoving: (itemId, isRemoving) => {
				set((state) => {
					const exists = state.removingItemIds.includes(itemId);
					if (isRemoving) {
						return exists ? state : { removingItemIds: [...state.removingItemIds, itemId] };
					}
					return exists
						? { removingItemIds: state.removingItemIds.filter((id) => id !== itemId) }
						: state;
				});
			},

			setItemUpdating: (itemId, isUpdating) => {
				set((state) => {
					const exists = state.updatingItemIds.includes(itemId);
					if (isUpdating) {
						return exists ? state : { updatingItemIds: [...state.updatingItemIds, itemId] };
					}
					return exists
						? { updatingItemIds: state.updatingItemIds.filter((id) => id !== itemId) }
						: state;
				});
			},

			isAddingProduct: (productId) => get().addingProductIds.includes(productId),
			isRemovingItem: (itemId) => get().removingItemIds.includes(itemId),
			isUpdatingItem: (itemId) => get().updatingItemIds.includes(itemId),

			loadCartFromApi: async () => {
				if (!hasToken()) return;
				try {
					const res = await getCart();
					if (res?.success && res.data?.cart) {
						const items = Array.isArray(res.data.cart.items)
							? res.data.cart.items.map(mapApiItem)
							: [];
						set({ cartItems: items });
						return;
					}
					if (res?.success === false) {
						notyf.error(res.msg || 'Erro ao carregar o carrinho.');
					}
				} catch {
					// silently ignore — offline / session expired
				}
			},

			addToCart: async (product, quantity = 1, showNotification = true, variant = null) => {
				if (!product?.id) return false;
				const { setProductAdding, loadCartFromApi } = get();
				setProductAdding(product.id, true);
				const variantId = variant?.id || null;
				const variantKey = variantId ? variantId : 'default';
				try {
					if (hasToken()) {
						try {
							const res = await addToCartApi(product.id, quantity, variantId);
							if (res?.success) {
								await loadCartFromApi();
								if (showNotification) notyf.success(res.msg || 'Produto adicionado ao carrinho!');
								return true;
							}
							notyf.error(res?.msg || 'Não foi possível adicionar ao carrinho.');
							return false;
						} catch {
							notyf.error('Erro ao adicionar ao carrinho.');
							return false;
						}
					}

					set((state) => {
						const key = `${product.id}:${variantKey}`;
						const existingItem = state.cartItems.find((item) => item.key === key || (item.productId === product.id && item.variantKey === variantKey));
						if (existingItem) {
							return {
								cartItems: state.cartItems.map((item) =>
									item.key === existingItem.key
										? { ...item, quantity: item.quantity + quantity }
										: item
								),
							};
						}
						return {
							cartItems: [
								...state.cartItems,
								normalizeCartItem({ ...product, variant: variant, variantId, variantKey, quantity }),
							],
						};
					});
					if (showNotification) notyf.success('Produto adicionado ao carrinho!');
					return true;
				} finally {
					setProductAdding(product.id, false);
				}
			},

			removeFromCart: async (itemId) => {
				const { setItemRemoving, loadCartFromApi } = get();
				setItemRemoving(itemId, true);
				try {
					if (hasToken()) {
						try {
							const res = await removeFromCartApi(itemId);
							if (res?.success) {
								await loadCartFromApi();
								notyf.error(res.msg || 'Produto removido do carrinho');
								return;
							}
							notyf.error(res?.msg || 'Não foi possível remover do carrinho.');
							return;
						} catch {
							notyf.error('Erro ao remover do carrinho.');
							return;
						}
					}

					set((state) => ({
						cartItems: state.cartItems.filter((item) => item.id !== itemId),
					}));
					notyf.error('Produto removido do carrinho');
				} finally {
					setItemRemoving(itemId, false);
				}
			},

			updateQuantity: async (itemId, quantity) => {
				if (quantity <= 0) {
					get().removeFromCart(itemId);
					return;
				}

				if (hasToken()) {
					const { setItemUpdating } = get();
					setItemUpdating(itemId, true);
					try {
						const res = await updateCartItem(itemId, quantity);
						if (res?.success) {
							await get().loadCartFromApi();
							return;
						}
						notyf.error(res?.msg || 'Não foi possível atualizar a quantidade.');
						return;
					} catch {
						notyf.error('Erro ao atualizar quantidade.');
						return;
					} finally {
						setItemUpdating(itemId, false);
					}
				}

				set((state) => ({
					cartItems: state.cartItems.map((item) =>
						item.id === itemId ? { ...item, quantity } : item
					),
				}));
			},

			clearCart: async () => {
				if (hasToken()) {
					try {
						const res = await clearCartApi();
						if (res?.success) {
							set({ cartItems: [] });
							return;
						}
						notyf.error(res?.msg || 'Não foi possível limpar o carrinho.');
						return;
					} catch {
						notyf.error('Erro ao limpar carrinho.');
						return;
					}
				}
				set({ cartItems: [] });
			},

			resetCart: () => set({ cartItems: [] }),

			getCartTotal: () => get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
			getCartCount: () => get().cartItems.reduce((count, item) => count + item.quantity, 0),
			getSubtotal: () => get().cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
			getShipping: () => 0,
			getTax: () => 0,

			getDiscount: () => {
				const { cartItems, appliedCoupon } = get();
				if (!appliedCoupon) return 0;
				const storeItemsTotal = cartItems
					.filter(item => (item.store?.id === appliedCoupon.storeId) || (item.product?.storeId === appliedCoupon.storeId))
					.reduce((sum, item) => sum + (item.price * item.quantity), 0);
				return storeItemsTotal * (appliedCoupon.discount / 100);
			},

			getTotal: () => {
				const state = get();
				return state.getSubtotal() + state.getShipping() + state.getTax() - state.getDiscount();
			},

			setAppliedCoupon: (coupon) => set({ appliedCoupon: coupon }),
		}),
		{
			name: 'cart',
			partialize: (state) => ({ cartItems: state.cartItems }),
			onRehydrateStorage: () => (state) => {
				if (state?.cartItems && state.cartItems.length > 0) {
					state.cartItems = state.cartItems.map(normalizeCartItem);
				}
			},
		}
	)
);

export default useCartStore;
export { formatVariantLabel };
