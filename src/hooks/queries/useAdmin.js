import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as adminService from '../../services/admin';
import { notyf } from '../../utils/notyf';

export const useAdminUsers = () =>
	useQuery({
		queryKey: ['admin', 'users'],
		queryFn: async () => {
			const res = await adminService.getAdminUsers();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar utilizadores');
			return res.data?.users || [];
		},
		refetchOnMount: 'always',
	});

export const useUpdateUserStatus = () => {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ userId, status }) => adminService.updateUserStatus(userId, status),
		onSuccess: (res) => {
			if (res.success) {
				notyf.success('Estado do utilizador atualizado');
				qc.invalidateQueries({ queryKey: ['admin', 'users'] });
			}
		},
	});
};

export const useAdminStores = () =>
	useQuery({
		queryKey: ['admin', 'stores'],
		queryFn: async () => {
			const res = await adminService.getAdminStores();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar lojas');
			return res.data?.stores || [];
		},
		refetchOnMount: 'always',
	});

export const useAdminProducts = () =>
	useQuery({
		queryKey: ['admin', 'products'],
		queryFn: async () => {
			const res = await adminService.getAdminProducts();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar produtos');
			return res.data?.products || [];
		},
		refetchOnMount: 'always',
	});

export const useAdminCategories = () =>
	useQuery({
		queryKey: ['admin', 'categories'],
		queryFn: async () => {
			const res = await adminService.getAdminCategories();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar categorias');
			return res.data?.categories || [];
		},
		refetchOnMount: 'always',
	});

export const useAdminIdentityVerifications = () =>
	useQuery({
		queryKey: ['admin', 'identity'],
		queryFn: async () => {
			const res = await adminService.getAdminIdentityVerifications();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar verificaçoes');
			return res.data?.verifications || [];
		},
		refetchOnMount: 'always',
	});

export const useAdminAnalytics = () =>
	useQuery({
		queryKey: ['admin', 'analytics'],
		queryFn: async () => {
			const res = await adminService.getAdminAnalytics();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar analíticos');
			return res.data || {};
		},
		refetchOnMount: 'always',
	});

export const useAdminPromotions = () =>
	useQuery({
		queryKey: ['admin', 'promotions'],
		queryFn: async () => {
			const res = await adminService.getAdminPromotions();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar promoções');
			return res.data?.promotions || [];
		},
		refetchOnMount: 'always',
	});
