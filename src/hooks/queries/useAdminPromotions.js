import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useAdminPromotionPackages = () =>
	useQuery({
		queryKey: ['admin', 'promotions', 'packages'],
		queryFn: async () => {
			const res = await http.get('/promotions/packages', { admin: true });
			if (!res?.success) return [];
			return res.data?.packages || [];
		},
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});

export const useCreatePromotionPackage = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (formData) => http.post('/promotions/packages', formData, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Pacote criado com sucesso');
				qc.invalidateQueries({ queryKey: ['admin', 'promotions', 'packages'] });
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro ao criar pacote.'),
	});
};

export const useUpdatePromotionPackage = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ id, formData }) => http.put(`/promotions/packages/${id}`, formData, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Pacote actualizado com sucesso');
				qc.invalidateQueries({ queryKey: ['admin', 'promotions', 'packages'] });
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro ao actualizar pacote.'),
	});
};

export const useDeletePromotionPackage = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id) => http.delete(`/promotions/packages/${id}`, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Pacote removido');
				qc.invalidateQueries({ queryKey: ['admin', 'promotions', 'packages'] });
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro ao remover pacote.'),
	});
};
