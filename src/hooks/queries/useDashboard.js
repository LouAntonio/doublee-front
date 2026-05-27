import { useQuery } from '@tanstack/react-query';
import http from '../../services/http';

export const useVerificationStatus = (userId) =>
	useQuery({
		queryKey: ['dashboard', 'verification-status', userId],
		queryFn: async () => {
			const res = await http.get('/users/verification-status');
			if (!res?.success) throw new Error('Erro ao carregar estado de verificação');
			return res.status || 'none';
		},
		enabled: Boolean(userId),
		staleTime: 1000 * 60 * 5,
		refetchOnMount: 'always',
	});

export const useStoreStatus = (userId, options = {}) =>
	useQuery({
		queryKey: ['dashboard', 'store-status', userId],
		queryFn: async () => {
			const res = await http.get('/stores/status');
			if (!res?.success) return 'none';
			return res.data?.status || 'none';
		},
		staleTime: 1000 * 60 * 5,
		refetchOnMount: 'always',
		...options,
	});

export const useMyStore = (userId) =>
	useQuery({
		queryKey: ['stores', 'mine', userId],
		queryFn: async () => {
			const res = await http.get('/stores/mine');
			if (!res?.success) throw new Error('Não foi possível carregar os dados da loja.');
			return res.data?.store || res.data || null;
		},
		enabled: Boolean(userId),
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});

export const useMyProducts = (userId) =>
	useQuery({
		queryKey: ['products', 'mine', userId],
		queryFn: async () => {
			const res = await http.get('/products/mine?limit=200');
			if (!res?.success) return { products: [], pagination: { total: 0, page: 1, limit: 200, totalPages: 0 } };
			return { products: res.data?.products || [], pagination: res.data?.pagination || { total: 0, page: 1, limit: 200, totalPages: 0 } };
		},
		enabled: Boolean(userId),
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});

export const useMyStoreOrders = (userId) =>
	useQuery({
		queryKey: ['stores', 'orders', userId],
		queryFn: async () => {
			const res = await http.get('/orders/store/my-orders');
			if (!res?.success) return [];
			return res.data?.orders || res.data || [];
		},
		enabled: Boolean(userId),
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});
