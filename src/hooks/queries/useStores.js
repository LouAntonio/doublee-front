import { useQuery } from '@tanstack/react-query';
import { getStores, getStore } from '../../services/stores';

export const useStores = (params = {}) =>
	useQuery({
		queryKey: ['stores', params],
		queryFn: async () => {
			const res = await getStores(params);
			console.log('🔍 useStores raw response:', res);
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar lojas');
			const mapped = {
				stores: res.data?.stores || res.data?.data || res.stores || [],
				total: res.data?.pagination?.total || res.data?.total || res.total || 0,
				totalPages: res.data?.pagination?.totalPages || res.data?.totalPages || res.totalPages || 1,
			};
			console.log('🔍 useStores mapped:', mapped);
			return mapped;
		},
		staleTime: 1000 * 60 * 5,
		refetchOnMount: 'always',
	});

export const useStore = (id) =>
	useQuery({
		queryKey: ['store', id],
		queryFn: async () => {
			const res = await getStore(id);
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar loja');
			return res.data?.store || res.data;
		},
		enabled: Boolean(id),
		staleTime: 1000 * 60 * 5,
	});
