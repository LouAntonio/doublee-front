import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getFeaturedStores } from '../../services/stores';
import { useStores } from '../../hooks/queries/useStores';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import Header from '../../components/Header';
import LojasHero from './LojasHero';
import LojasStats from './LojasStats';
import FeaturedStores from './FeaturedStores';
import StoreGrid from './StoreGrid';
import Pagination from './Pagination';
import { FaExclamationTriangle } from 'react-icons/fa';
import './lojas.css';

const ITEMS_PER_PAGE = 8;

const Lojas = () => {
	useDocumentTitle('Lojas - Double E');

	const [searchParams] = useSearchParams();
	const search = searchParams.get('search') || '';
	const currentPage = parseInt(searchParams.get('page') || '1', 10);

	const { data: featuredStores = [], isLoading: loadingFeatured } = useQuery({
		queryKey: ['stores', 'featured'],
		queryFn: async () => {
			const res = await getFeaturedStores();
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar lojas em destaque');
			return res.data?.stores || [];
		},
		staleTime: 1000 * 60 * 10,
	});

	const { data, isLoading, isError } = useStores({
		page: currentPage,
		limit: ITEMS_PER_PAGE,
		...(search.trim() && { search: search.trim() }),
	});

	const stores = useMemo(() => data?.stores || [], [data]);
	const total = useMemo(() => data?.total || 0, [data]);
	const totalPages = useMemo(() => data?.totalPages || 1, [data]);

	const mergedStores = useMemo(() => {
		if (stores.length > 0) return stores;
		if (!search && featuredStores.length > 0) {
			return featuredStores;
		}
		return stores;
	}, [stores, featuredStores, search]);

	const mergedTotal = useMemo(() => {
		if (stores.length > 0) return total;
		if (!search && featuredStores.length > 0) return featuredStores.length;
		return total;
	}, [stores, featuredStores, search, total]);

	return (
		<div className="bg-[var(--lojas-cream)] flex flex-col min-h-screen">
			<Header />
			<LojasHero />

			<LojasStats />

			{!search && (loadingFeatured || featuredStores.length > 0) && (
				<FeaturedStores stores={featuredStores} isLoading={loadingFeatured} />
			)}

			<div className="px-4 pb-16 flex-1">
				<div className="max-w-[1200px] mx-auto">
					<div className="flex items-end justify-between mb-8 mt-10">
						<div>
							<h2 className="text-2xl font-bold text-[var(--lojas-charcoal)] font-heading">
								{search ? 'Resultados da pesquisa' : 'Todas as Lojas'}
							</h2>
							<div className="w-10 h-0.5 bg-[var(--lojas-accent)] mt-2" />
						</div>
						{!isLoading && (
							<span className="text-sm text-[var(--lojas-muted)] font-medium">
								{mergedTotal} {mergedTotal === 1 ? 'loja' : 'lojas'}
							</span>
						)}
					</div>

					{isError ? (
						<div role="alert" className="text-center py-20 text-[var(--lojas-muted)]">
							<FaExclamationTriangle className="text-4xl mx-auto mb-4 opacity-30" />
							<p className="text-base font-semibold text-[var(--lojas-text)]">
								Erro ao carregar lojas.
							</p>
							<p className="text-sm mt-1 text-[var(--lojas-muted)]">
								Tenta novamente mais tarde.
							</p>
						</div>
					) : (
						<>
							<StoreGrid
								stores={mergedStores}
								loading={isLoading}
								search={search}
								total={mergedTotal}
							/>
							<Pagination totalPages={totalPages} />
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Lojas;
