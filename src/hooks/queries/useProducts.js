import { useQuery } from '@tanstack/react-query';
import { getProducts, getProduct, getFeaturedProducts, getBestSellers, getLatestProducts, getPromotions, getProductsByRandomCategory } from '../../services/products';

const extractSuccess = (res, fallback = []) => {
	if (!res.success) throw new Error(res.msg || 'Erro ao carregar dados');
	return res.data ?? fallback;
};

export const useProducts = (params = {}) =>
	useQuery({
		queryKey: ['products', params],
		queryFn: async () => {
			const res = await getProducts(params);
			return {
				products: (res.data?.products || []).map(p => ({
					id: p.id,
					title: p.name,
					price: p.promotionalPrice ?? p.price,
					oldPrice: p.promotionalPrice ? p.price : undefined,
					promotionalPrice: p.promotionalPrice,
					promotionalEndDate: p.promotionalEndDate,
					image: p.image || '/images/produto.png',
					rating: p.rating,
					reviewCount: p.qtdRatings,
				})),
				total: res.data?.pagination?.total || 0,
				totalPages: res.data?.pagination?.totalPages || 1,
			};
		},
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});

export const useProduct = (id) =>
	useQuery({
		queryKey: ['product', id],
		queryFn: () => getProduct(id).then(extractSuccess),
		enabled: Boolean(id),
		staleTime: 1000 * 60 * 5,
	});

export const useFeaturedProducts = () =>
	useQuery({
		queryKey: ['products', 'featured'],
		queryFn: () => getFeaturedProducts().then(extractSuccess),
		staleTime: 1000 * 60 * 10,
		refetchOnMount: 'always',
	});

export const useBestSellers = () =>
	useQuery({
		queryKey: ['products', 'best-sellers'],
		queryFn: () => getBestSellers().then(extractSuccess),
		staleTime: 1000 * 60 * 10,
		refetchOnMount: 'always',
	});

export const useLatestProducts = () =>
	useQuery({
		queryKey: ['products', 'latest'],
		queryFn: () => getLatestProducts().then(extractSuccess),
		staleTime: 1000 * 60 * 10,
		refetchOnMount: 'always',
	});

export const usePromotions = () =>
	useQuery({
		queryKey: ['products', 'promotions'],
		queryFn: () => getPromotions().then(extractSuccess),
		staleTime: 1000 * 60 * 5,
		refetchOnMount: 'always',
	});

export const useProductsByRandomCategory = (limit = 20) =>
	useQuery({
		queryKey: ['products', 'random-by-category', limit],
		queryFn: () => getProductsByRandomCategory(limit).then(extractSuccess),
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});
