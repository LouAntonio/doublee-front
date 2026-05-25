import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getCart, addToCartApi, removeFromCartApi, updateCartItem, clearCartApi } from '../services/cart';
import { notyf } from '../utils/notyf';

const mapApiItem = (item) => ({
	id: item.id,
	productId: item.product?.id ?? item.productId,
	name: item.product?.name ?? item.name,
	price: (item.product?.promotionalPrice && Number(item.product.promotionalPrice) > 0)
		? Number(item.product.promotionalPrice)
		: Number(item.product?.price ?? item.price ?? 0),
	image: item.product?.image ?? item.image,
	quantity: item.quantity,
	stock: item.product?.stock ?? item.stock,
	store: item.product?.store ?? item.store,
});

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

			addToCart: async (product, quantity = 1, showNotification = true) => {
				if (!product?.id) return;
				const { setProductAdding, loadCartFromApi } = get();
				setProductAdding(product.id, true);
				try {
					if (hasToken()) {
						try {
							const res = await addToCartApi(product.id, quantity);
							if (res?.success) {
								await loadCartFromApi();
								if (showNotification) notyf.success(res.msg || 'Produto adicionado ao carrinho!');
								return;
							}
							notyf.error(res?.msg || 'Não foi possível adicionar ao carrinho.');
							return;
						} catch {
							notyf.error('Erro ao adicionar ao carrinho.');
							return;
						}
					}

					set((state) => {
						const existingItem = state.cartItems.find((item) => item.id === product.id);
						if (existingItem) {
							return {
								cartItems: state.cartItems.map((item) =>
									item.id === product.id
										? { ...item, quantity: item.quantity + quantity }
										: item
								),
							};
						}
						return { cartItems: [...state.cartItems, { ...product, quantity }] };
					});
					if (showNotification) notyf.success('Produto adicionado ao carrinho!');
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
		}
	)
);

export default useCartStore;
