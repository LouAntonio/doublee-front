import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useMyOrders = () =>
	useQuery({
		queryKey: ['orders', 'mine'],
		queryFn: async () => {
			const res = await http.get('/orders');
			if (!res?.success) return [];
			return res.data?.orders || res.data || [];
		},
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});

export const useCreateOrder = () =>
	useMutation({
		mutationFn: (orderData) => http.post('/orders', orderData),
		onSuccess: (res) => {
			if (!res?.success) {
				notyf.error(res?.msg || 'Erro ao realizar pedido.');
				throw new Error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro ao conectar ao servidor.'),
	});

export const useUpdateOrderStatus = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ orderId, status }) =>
			http.patch(`/stores/orders/${orderId}/status`, { status }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Estado actualizado!');
				qc.invalidateQueries({ queryKey: ['stores', 'orders'] });
			} else {
				notyf.error(res?.msg || 'Erro ao actualizar estado.');
			}
		},
		onError: () => notyf.error('Erro ao conectar com o servidor.'),
	});
};
