import { useQuery } from '@tanstack/react-query';
import { getStores, getStore } from '../../services/stores';

export const useStores = (params = {}) =>
	useQuery({
		queryKey: ['stores', params],
		queryFn: async () => {
			const res = await getStores(params);
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar lojas');
			return {
				stores: res.data?.stores || [],
				total: res.data?.pagination?.total || 0,
				totalPages: res.data?.pagination?.totalPages || 1,
			};
		},
		staleTime: 1000 * 60 * 5,
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
