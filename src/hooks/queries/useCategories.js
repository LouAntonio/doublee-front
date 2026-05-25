import { useQuery } from '@tanstack/react-query';
import { getCategories } from '../../services/categories';

export const useCategories = () =>
	useQuery({
		queryKey: ['categories'],
		queryFn: async () => {
			const res = await getCategories();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar categorias');
			return res.data?.categories || [];
		},
		staleTime: 1000 * 60 * 10,
	});
