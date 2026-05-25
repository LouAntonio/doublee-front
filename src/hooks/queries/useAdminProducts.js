import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useAdminProductsList = ({ page, limit, search, filters, storeId, minPrice, maxPrice }) =>
	useQuery({
		queryKey: ['admin', 'products', { page, limit, search, filters, storeId, minPrice, maxPrice }],
		queryFn: async () => {
			let query = `/admin/products?page=${page}&limit=${limit}&search=${search}`;
			if (filters.featured !== '') query += `&featured=${filters.featured}`;
			if (filters.onPromotion !== '') query += `&onPromotion=${filters.onPromotion}`;
			if (storeId !== '') query += `&storeId=${storeId}`;
			if (minPrice !== '') query += `&minPrice=${minPrice}`;
			if (maxPrice !== '') query += `&maxPrice=${maxPrice}`;

			const res = await http.get(query);
			if (!res?.success) return { products: [], pagination: { page: 1, limit: 10, totalPages: 1 } };
			return {
				products: res.data?.products || res.data || [],
				pagination: res.data?.pagination || { page, limit, totalPages: 1 },
			};
		},
		staleTime: 1000 * 30,
		keepPreviousData: true,
	});

export const useAdminAllStores = () =>
	useQuery({
		queryKey: ['admin', 'stores', 'all'],
		queryFn: async () => {
			const res = await http.get('/admin/stores?limit=1000');
			if (res?.success && res.data && res.data.stores) return res.data.stores;
			return [];
		},
		staleTime: 1000 * 60 * 10,
	});

export const useUpdateProductStatus = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, status, motive }) => http.patch('/admin/products/status', { id, status, motive }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success(res.msg || 'Status atualizado com sucesso.');
				qc.invalidateQueries({ queryKey: ['admin', 'products'] });
			} else {
				notyf.error(res?.msg || 'Erro ao atualizar status.');
			}
		},
		onError: () => notyf.error('Erro ao atualizar status.'),
	});
};
