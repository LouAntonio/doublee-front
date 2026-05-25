import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';

const hasToken = () => Boolean(localStorage.getItem('doublee_token'));

export const useCartQuery = () =>
	useQuery({
		queryKey: ['cart'],
		queryFn: async () => {
			const res = await http.get('/cart');
			if (res?.success && res.data?.cart) {
				const items = Array.isArray(res.data.cart.items) ? res.data.cart.items : [];
				return items;
			}
			return [];
		},
		enabled: hasToken(),
		staleTime: 1000 * 30,
	});

export const useAddToCartMutation = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ productId, quantity }) => http.post('/cart', { productId, quantity }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
	});
};

export const useRemoveFromCartMutation = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (itemId) => http.delete(`/cart/${itemId}`),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
	});
};

export const useUpdateCartItemMutation = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ itemId, quantity }) => http.patch(`/cart/${itemId}`, { quantity }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
	});
};

export const useClearCartMutation = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: () => http.delete('/cart'),
		onSuccess: () => qc.invalidateQueries({ queryKey: ['cart'] }),
	});
};
