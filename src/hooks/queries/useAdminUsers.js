import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useAdminUsersList = ({ page, limit, search }) =>
	useQuery({
		queryKey: ['admin', 'users', { page, limit, search }],
		queryFn: async () => {
			const res = await http.post('/admin/users', { page, limit, search }, { admin: true });
			if (res?.success && res.data) {
				return {
					users: res.data.users,
					pagination: res.data.pagination || { page, limit, totalPages: 1 },
				};
			}
			return { users: [], pagination: { page, limit, totalPages: 1 } };
		},
		staleTime: 1000 * 30,
		keepPreviousData: true,
	});

export const useToggleUserStatus = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (userId) => http.patch('/admin/users/status', { userId }, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success(res.msg);
				qc.invalidateQueries({ queryKey: ['admin', 'users'] });
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro de conexão ao alterar estado.'),
	});
};

export const useToggleUserRole = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (userId) => http.patch('/admin/users/role', { userId }, { admin: true }),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success(res.msg);
				qc.invalidateQueries({ queryKey: ['admin', 'users'] });
			} else {
				notyf.error(res?.msg);
			}
		},
		onError: () => notyf.error('Erro de conexão ao alterar papel.'),
	});
};
