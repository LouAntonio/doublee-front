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

export const useSubmitPaymentProof = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ orderId, paymentMethod, paymentProof }) =>
			http.post(`/orders/${orderId}/payment-proof`, { paymentMethod, paymentProof }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Comprovativo submetido! Aguarde confirmação.');
				qc.invalidateQueries({ queryKey: ['orders', 'mine'] });
			} else {
				notyf.error(res?.msg || 'Erro ao submeter comprovativo.');
			}
		},
		onError: () => notyf.error('Erro ao conectar ao servidor.'),
	});
};

export const useAdminOrders = (filters) =>
	useQuery({
		queryKey: ['admin', 'orders', filters],
		queryFn: async () => {
			const res = await http.post('/admin/orders', filters || {}, { admin: true });
			if (!res?.success) return { orders: [], pagination: null };
			return res.data;
		},
		staleTime: 1000 * 30,
	});

export const useAdminOrder = (id) =>
	useQuery({
		queryKey: ['admin', 'orders', id],
		queryFn: async () => {
			const res = await http.get(`/admin/orders/${id}`, { admin: true });
			if (!res?.success) return null;
			return res.data?.order || null;
		},
		enabled: !!id,
	});

export const useConfirmPayment = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (orderId) => http.patch(`/admin/orders/${orderId}/confirm-payment`, {}, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Pagamento confirmado!');
				qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
			} else {
				notyf.error(res?.msg || 'Erro ao confirmar pagamento.');
			}
		},
		onError: () => notyf.error('Erro ao conectar ao servidor.'),
	});
};

export const useRejectPayment = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ orderId, reason }) =>
			http.patch(`/admin/orders/${orderId}/reject-payment`, { reason }, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Comprovativo rejeitado.');
				qc.invalidateQueries({ queryKey: ['admin', 'orders'] });
			} else {
				notyf.error(res?.msg || 'Erro ao rejeitar comprovativo.');
			}
		},
		onError: () => notyf.error('Erro ao conectar ao servidor.'),
	});
};