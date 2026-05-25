import { Link } from 'react-router-dom';
import { IoStarSharp } from 'react-icons/io5';
import StoreLogo from './StoreLogo';

const StoreCard = ({ store }) => {
	const rating = Math.round(store.rating ?? 0);

	return (
		<article className="group bg-white rounded-2xl overflow-hidden border border-[var(--lojas-border)] flex flex-col lojas-card-hover shadow-sm hover:shadow-lg">
			<div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
				{store.banner ? (
					<img
						src={store.banner}
						alt={store.name}
						className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				) : (
					<div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400" />
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

				{store.featured && (
					<span className="absolute top-2.5 right-2.5 text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--lojas-accent)] text-white lojas-badge-pulse">
						Destaque
					</span>
				)}

				<div className="absolute -bottom-5 left-3">
					<div className="w-12 h-12 rounded-xl overflow-hidden shadow-lg ring-2 ring-white">
						<StoreLogo logo={store.logo} name={store.name} />
					</div>
				</div>
			</div>

			<div className="pt-8 px-4 pb-4 flex flex-col flex-1">
				<h3 className="font-heading font-bold text-[var(--lojas-charcoal)] text-base leading-tight mb-1">
					{store.name}
				</h3>

				<div className="flex items-center gap-0.5 mb-3">
					{[1, 2, 3, 4, 5].map((i) => (
						<IoStarSharp
							key={i}
							className={i <= rating ? 'text-[var(--lojas-gold)] text-xs' : 'text-gray-200 text-xs'}
						/>
					))}
					<span className="ml-1 text-xs font-semibold text-[var(--lojas-text)]">
						{store.rating}
					</span>
					<span className="text-xs text-[var(--lojas-muted)] ml-0.5">
						({store.qtdRatings ?? 0})
					</span>
				</div>

				<div className="mt-auto">
					<Link
						to={`/loja/${store.id}`}
						className="lojas-arrow-btn inline-flex items-center justify-center w-full py-2 rounded-xl text-sm font-semibold border border-[var(--lojas-accent)] text-[var(--lojas-accent)] hover:bg-[var(--lojas-accent)] hover:text-white transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20"
						aria-label={`Ver loja ${store.name}`}
					>
						Ver Loja
						<span className="lojas-arrow-icon ml-1.5 inline-block">&rarr;</span>
					</Link>
				</div>
			</div>
		</article>
	);
};

export default StoreCard;
