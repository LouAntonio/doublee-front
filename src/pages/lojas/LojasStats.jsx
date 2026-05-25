import { IoStorefrontOutline, IoShieldCheckmarkOutline } from 'react-icons/io5';
import { FaBoxOpen, FaUsers } from 'react-icons/fa';

const stats = [
	{ icon: <IoStorefrontOutline />, value: '120+', label: 'Lojas Parceiras' },
	{ icon: <FaBoxOpen />, value: '50 mil+', label: 'Produtos Disponíveis' },
	{ icon: <FaUsers />, value: '200 mil+', label: 'Clientes Satisfeitos' },
	{ icon: <IoShieldCheckmarkOutline />, value: '100%', label: 'Compra Segura' },
];

const LojasStats = () => (
	<section
		aria-label="Estatísticas"
		className="bg-[var(--lojas-cream)] border-b border-[var(--lojas-border)] relative overflow-hidden"
	>
		<div className="absolute inset-0 lojas-dot-grid opacity-30" />
		<div className="max-w-[1200px] mx-auto px-4 py-6 md:py-7 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-5 relative">
			{stats.map((s, i) => (
				<div
					key={i}
					className={`flex items-center gap-3 ${i % 2 === 0 ? 'lojas-float' : 'lojas-float-delayed'}`}
				>
					<div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-50 to-orange-100 text-[var(--lojas-accent)] flex items-center justify-center flex-shrink-0 shadow-sm text-xl">
						{s.icon}
					</div>
					<div>
						<p className="text-xl font-bold text-[var(--lojas-charcoal)] leading-tight font-heading">
							{s.value}
						</p>
						<p className="text-xs text-[var(--lojas-muted)] font-medium">{s.label}</p>
					</div>
				</div>
			))}
		</div>
	</section>
);

export default LojasStats;
