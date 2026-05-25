import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useAdminStoresList = ({ page, limit, search }) =>
	useQuery({
		queryKey: ['admin', 'stores', { page, limit, search }],
		queryFn: async () => {
			const query = new URLSearchParams({ page, limit, search }).toString();
			const res = await http.get(`/admin/stores?${query}`, { admin: true });
			if (res?.success && res.data) {
				return {
					stores: res.data.stores,
					pagination: res.data.pagination || { page, limit, totalPages: 1 },
				};
			}
			return { stores: [], pagination: { page, limit, totalPages: 1 } };
		},
		staleTime: 1000 * 30,
		keepPreviousData: true,
	});

export const useUpdateStoreStatus = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ storeId, status, emailSubject, emailBody }) =>
			http.patch(`/admin/stores/${storeId}/status`, {
				status,
				emailSubject: status === 'approved' ? undefined : emailSubject,
				emailBody: status === 'approved' ? undefined : emailBody,
			}, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success(res.msg || 'Status atualizado com sucesso.');
				qc.invalidateQueries({ queryKey: ['admin', 'stores'] });
			} else {
				notyf.error(res?.msg || 'Erro ao atualizar status.');
			}
		},
		onError: () => notyf.error('Erro de conexão.'),
	});
};
