import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useAdminCategoriesList = () =>
	useQuery({
		queryKey: ['admin', 'categories'],
		queryFn: async () => {
			const res = await http.get('/categories');
			if (!res?.success) return [];
			return res.data?.categories || [];
		},
		staleTime: 1000 * 60 * 2,
	});

export const useCreateCategory = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload) => http.post('/admin/categories', payload, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Categoria criada com sucesso');
				qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro ao criar categoria.'),
	});
};

export const useUpdateCategory = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload) => http.put('/admin/categories', payload, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Categoria atualizada com sucesso');
				qc.invalidateQueries({ queryKey: ['admin', 'categories'] });
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro ao atualizar categoria.'),
	});
};
