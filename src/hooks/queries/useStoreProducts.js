import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useCreateProduct = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload) => http.post('/products', payload),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Produto adicionado!');
				qc.invalidateQueries({ queryKey: ['products', 'mine'] });
			} else {
				notyf.error(res?.msg || 'Erro ao guardar produto.');
			}
		},
		onError: () => notyf.error('Erro ao conectar com o servidor.'),
	});
};

export const useUpdateProduct = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, payload }) => http.put(`/products/${id}`, payload),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Produto actualizado!');
				qc.invalidateQueries({ queryKey: ['products', 'mine'] });
			} else {
				notyf.error(res?.msg || 'Erro ao guardar produto.');
			}
		},
		onError: () => notyf.error('Erro ao conectar com o servidor.'),
	});
};

export const useDeleteProduct = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id) => http.delete(`/products/${id}`),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Produto eliminado.');
				qc.invalidateQueries({ queryKey: ['products', 'mine'] });
			} else {
				notyf.error(res?.msg || 'Erro ao eliminar produto.');
			}
		},
		onError: () => notyf.error('Erro ao conectar com o servidor.'),
	});
};

export const useCategoriesSimple = () =>
	useQuery({
		queryKey: ['categories', 'simple'],
		queryFn: async () => {
			const res = await http.get('/categories');
			if (!res?.success) return [];
			return res.data?.categories || [];
		},
		staleTime: 1000 * 60 * 10,
		refetchOnMount: 'always',
	});
