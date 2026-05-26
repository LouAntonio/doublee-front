import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useSellerVerifications = () =>
	useQuery({
		queryKey: ['admin', 'seller-verifications'],
		queryFn: async () => {
			const data = await http.get('/admin/unverified-sellers', { admin: true });
			if (data?.success) return data.sellers || [];
			return [];
		},
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});

export const useApproveSeller = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (userId) => http.post('/admin/approve-seller', { sellerId: userId, approve: true }, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Vendedor verificado com sucesso!');
				qc.invalidateQueries({ queryKey: ['admin', 'seller-verifications'] });
			} else {
				notyf.error(res?.msg || 'Erro ao aprovar vendedor.');
			}
		},
		onError: () => notyf.error('Erro ao comunicar com o servidor.'),
	});
};

export const useRejectSeller = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, message, validatedSeller }) => {
			const endpoint = validatedSeller ? '/admin/revoke-seller' : '/admin/approve-seller';
			const body = validatedSeller
				? { sellerId: userId, message }
				: { sellerId: userId, approve: false, message };
			return http.post(endpoint, body, { admin: true });
		},
		onSuccess: (res, vars) => {
			if (res?.success) {
				notyf.success(vars.validatedSeller ? 'Verificação revogada.' : 'Candidatura rejeitada.');
				qc.invalidateQueries({ queryKey: ['admin', 'seller-verifications'] });
			} else {
				notyf.error(res?.msg || 'Erro ao processar ação.');
			}
		},
		onError: () => notyf.error('Erro ao comunicar com o servidor.'),
	});
};
