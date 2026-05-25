import { useEffect, useRef } from 'react';
import { FaStore } from 'react-icons/fa';
import StoreCard from './StoreCard';
import StoreCardSkeleton from './StoreCardSkeleton';

const ITEMS_PER_PAGE = 8;

const StoreGrid = ({ stores, loading, search }) => {
	const gridRef = useRef(null);

	useEffect(() => {
		if (loading || stores.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('lojas-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
		);

		const cards = gridRef.current?.querySelectorAll('.lojas-reveal');
		cards?.forEach((el) => observer.observe(el));

		return () => observer.disconnect();
	}, [loading, stores.length]);

	if (loading) {
		return (
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
				{Array.from({ length: ITEMS_PER_PAGE }, (_, i) => (
					<StoreCardSkeleton key={i} />
				))}
			</div>
		);
	}

	if (stores.length === 0) {
		return (
			<div
				role="status"
				aria-live="polite"
				className="text-center py-24 text-[var(--lojas-muted)]"
			>
				<div className="lojas-empty-float">
					<FaStore className="text-6xl mx-auto mb-4 opacity-15" />
				</div>
				<p className="text-lg font-heading font-semibold text-[var(--lojas-text)]">
					Nenhuma loja encontrada.
				</p>
				<p className="text-sm mt-1 text-[var(--lojas-muted)]">
					{search
						? 'Tenta outro nome de pesquisa.'
						: 'Nenhuma loja disponível de momento.'}
				</p>
			</div>
		);
	}

	return (
		<div
			ref={gridRef}
			className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
		>
			{stores.map((store, index) => (
				<div
					key={store.id}
					className="lojas-reveal"
					style={{ transitionDelay: `${(index % 5) * 100}ms` }}
				>
					<StoreCard store={store} />
				</div>
			))}
		</div>
	);
};

export default StoreGrid;
