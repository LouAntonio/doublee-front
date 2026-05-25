import { useQuery } from '@tanstack/react-query';
import { getCoupons } from '../../services/coupons';

export const useCoupons = () =>
	useQuery({
		queryKey: ['coupons'],
		queryFn: async () => {
			const res = await getCoupons();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar cupões');
			return res.data?.coupons || [];
		},
		staleTime: 1000 * 60 * 5,
	});
