import { useQuery } from '@tanstack/react-query';
import http from '../../services/http';

export const useVerificationStatus = () =>
	useQuery({
		queryKey: ['dashboard', 'verification-status'],
		queryFn: async () => {
			const res = await http.get('/users/verification-status');
			if (!res?.success) throw new Error('Erro ao carregar estado de verificação');
			return res.status || 'none';
		},
		staleTime: 1000 * 60 * 5,
	});

export const useStoreStatus = (options = {}) =>
	useQuery({
		queryKey: ['dashboard', 'store-status'],
		queryFn: async () => {
			const res = await http.get('/stores/status');
			if (!res?.success) return 'none';
			return res.data?.status || 'none';
		},
		staleTime: 1000 * 60 * 5,
		...options,
	});

export const useMyStore = () =>
	useQuery({
		queryKey: ['stores', 'mine'],
		queryFn: async () => {
			const res = await http.get('/stores/mine');
			if (!res?.success) throw new Error('Não foi possível carregar os dados da loja.');
			return res.data?.store || res.data || null;
		},
		staleTime: 1000 * 60 * 2,
	});

export const useMyProducts = () =>
	useQuery({
		queryKey: ['products', 'mine'],
		queryFn: async () => {
			const res = await http.get('/products/mine');
			if (!res?.success) return [];
			return res.data?.products || res.data || [];
		},
		staleTime: 1000 * 60 * 2,
	});

export const useMyStoreOrders = () =>
	useQuery({
		queryKey: ['stores', 'orders'],
		queryFn: async () => {
			const res = await http.get('/stores/orders');
			if (!res?.success) return [];
			return res.data?.orders || res.data || [];
		},
		staleTime: 1000 * 60 * 2,
	});
