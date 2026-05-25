import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const usePromotionPackages = () =>
	useQuery({
		queryKey: ['promotions', 'packages'],
		queryFn: async () => {
			const res = await http.get('/promotions/packages?isActive=true');
			if (!res?.success) return [];
			return res.data?.packages || [];
		},
		staleTime: 1000 * 60 * 10,
	});

export const usePromotionPurchases = () =>
	useQuery({
		queryKey: ['promotions', 'purchases'],
		queryFn: async () => {
			const res = await http.get('/promotions/purchases');
			if (!res?.success) return [];
			return res.data?.purchases || [];
		},
		staleTime: 1000 * 60 * 2,
	});

export const usePurchasePromotion = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload) => http.post('/promotions/purchase', payload),
		onSuccess: async (res) => {
			if (res?.success) {
				notyf.success('Solicitação criada! Simulando confirmação de pagamento...');
				try {
					await http.post('/promotions/confirm-payment', {
						purchaseId: res.data.purchaseId,
						transactionRef: 'MOCK-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
					});
					notyf.success('Destaque activado com sucesso!');
					qc.invalidateQueries({ queryKey: ['promotions'] });
				} catch {
					notyf.error('Erro ao confirmar pagamento.');
				}
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro ao processar compra.'),
	});
};
