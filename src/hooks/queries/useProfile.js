import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../../services/http';
import { notyf } from '../../utils/notyf';

export const useUpdateProfile = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (formData) => http.put('/users/update-profile', formData),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Perfil atualizado com sucesso!');
				qc.invalidateQueries({ queryKey: ['auth', 'user'] });
			} else {
				notyf.error(res?.msg || 'Erro ao atualizar perfil.');
			}
		},
		onError: () => notyf.error('Erro ao conectar com o servidor.'),
	});
};

export const useUpdateStoreProfile = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (payload) => http.put('/stores/update', payload),
		onSuccess: (res) => {
			if (res?.success) {
				notyf.success('Informações da loja actualizadas!');
				qc.invalidateQueries({ queryKey: ['stores', 'mine'] });
			} else {
				notyf.error(res?.msg || 'Erro ao actualizar loja.');
			}
		},
		onError: () => notyf.error('Erro ao conectar com o servidor.'),
	});
};

export const useValidateCoupon = () =>
	useMutation({
		mutationFn: (code) => http.post('/coupons/validate', { code }),
	});
