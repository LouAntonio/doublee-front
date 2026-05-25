import { Link } from 'react-router-dom';
import { IoStarSharp, IoTrophyOutline } from 'react-icons/io5';
import StoreLogo from './StoreLogo';

const FeaturedSkeleton = () => (
	<div
		className="relative overflow-hidden rounded-2xl border border-[var(--lojas-border)] lojas-shimmer"
		style={{ aspectRatio: '4/3' }}
	>
		<div className="absolute inset-0 bg-gradient-to-t from-[#e0d6cc]/30 via-transparent to-transparent" />
		<div className="absolute top-2.5 left-2.5">
			<div className="h-5 w-20 bg-[#e0d6cc] rounded-full" />
		</div>
		<div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end gap-2.5">
			<div className="w-10 h-10 rounded-xl border-2 border-white shadow bg-[#e0d6cc] flex-shrink-0" />
			<div className="min-w-0 flex-1">
				<div className="h-4 bg-[#e0d6cc] rounded w-2/3 mb-1" />
				<div className="h-2.5 bg-[#e0d6cc] rounded w-1/3" />
			</div>
		</div>
	</div>
);

const FeaturedStores = ({ stores = [], isLoading = false }) => {
	if (isLoading) {
		return (
			<section
				aria-label="Lojas em Destaque"
				className="px-4 py-14 bg-[var(--lojas-cream)]"
			>
				<div className="max-w-[1200px] mx-auto">
					<div className="flex items-center gap-3 mb-8">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-[var(--lojas-accent)] flex items-center justify-center shadow-md shadow-orange-200">
							<IoTrophyOutline className="text-white text-sm" />
						</div>
						<h2 className="text-2xl font-bold text-[var(--lojas-charcoal)] font-heading">
							Lojas em Destaque
						</h2>
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
						{[1, 2, 3, 4, 5].map((i) => (
							<FeaturedSkeleton key={i} />
						))}
					</div>
				</div>
			</section>
		);
	}

	if (stores.length === 0) return null;

	return (
		<section
			aria-label="Lojas em Destaque"
			className="px-4 py-14 bg-[var(--lojas-cream)]"
		>
			<div className="max-w-[1200px] mx-auto">
				<div className="flex items-center gap-3 mb-8">
					<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-[var(--lojas-accent)] flex items-center justify-center shadow-md shadow-orange-200">
						<IoTrophyOutline className="text-white text-sm" />
					</div>
					<h2 className="text-2xl font-bold text-[var(--lojas-charcoal)] font-heading">
						Lojas em Destaque
					</h2>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
					{stores.map((store) => (
						<Link
							to={`/loja/${store.id}`}
							key={store.id}
							className="group relative overflow-hidden rounded-2xl border border-[var(--lojas-border)] shadow-sm hover:shadow-xl transition-all duration-500 lojas-card-hover block"
						>
							<div className="relative aspect-[4/3]">
								{store.banner ? (
									<img
										src={store.banner}
										alt={store.name}
										className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
									/>
								) : (
									<div className="absolute inset-0 bg-gradient-to-br from-orange-300 via-orange-400 to-orange-500" />
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
							</div>

							<div className="absolute top-2.5 left-2.5">
								<span className="bg-[var(--lojas-accent)] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg lojas-badge-pulse">
									Destaque
								</span>
							</div>

							<div className="absolute bottom-0 left-0 right-0 p-4 flex items-end gap-2.5">
								<div className="w-10 h-10 rounded-xl border-2 border-white shadow-lg flex-shrink-0 overflow-hidden bg-white">
									<StoreLogo logo={store.logo} name={store.name} />
								</div>
								<div className="min-w-0">
									<p className="text-white font-bold text-sm leading-tight font-heading">
										{store.name}
									</p>
									<div className="flex items-center gap-1 mt-0.5">
										<IoStarSharp className="text-yellow-400 text-xs" />
										<span className="text-white/90 text-xs font-medium">
											{store.rating}
										</span>
										<span className="text-white/60 text-xs">
											({store.qtdRatings ?? 0})
										</span>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
};

export default FeaturedStores;
