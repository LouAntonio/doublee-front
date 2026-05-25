import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useMyCoupons = () =>
	useQuery({
		queryKey: ['coupons', 'mine'],
		queryFn: async () => {
			const res = await http.get('/coupons/mine');
			if (!res?.success) return [];
			return res.data || [];
		},
		staleTime: 1000 * 60 * 2,
	});

export const useCreateCoupon = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (formData) => http.post('/coupons', formData),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Cupão criado com sucesso!');
				qc.invalidateQueries({ queryKey: ['coupons', 'mine'] });
			} else {
				notyf.error(res?.msg || 'Erro ao criar cupão');
			}
		},
		onError: () => notyf.error('Erro ao conectar ao servidor'),
	});
};

export const useDeleteCoupon = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id) => http.delete(`/coupons/${id}`),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Cupão eliminado!');
				qc.invalidateQueries({ queryKey: ['coupons', 'mine'] });
			}
		},
		onError: () => notyf.error('Erro ao eliminar cupão'),
	});
};
