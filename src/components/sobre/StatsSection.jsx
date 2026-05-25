import React from 'react';
import { FaUsers, FaShoppingCart, FaAward, FaStar } from 'react-icons/fa';

const stats = [
	{ icon: <FaUsers />, value: '50K+', label: 'Clientes Satisfeitos', highlight: true },
	{ icon: <FaShoppingCart />, value: '100K+', label: 'Produtos Vendidos' },
	{ icon: <FaAward />, value: '15+', label: 'Prémios Recebidos' },
	{ icon: <FaStar />, value: '4.8/5', label: 'Avaliação Média' },
];

const StatsSection = () => {
	return (
		<section className="relative -mt-16 z-20 max-w-[1200px] mx-auto px-4">
			<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
				{stats.map((stat, idx) => (
					<div
						key={idx}
						className={`opacity-0 animate-bounce-in rounded-2xl p-6 md:p-8 text-center transition-all duration-500 hover:-translate-y-1 ${
							stat.highlight
								? 'bg-accent text-white shadow-xl md:col-span-1 md:row-span-1 flex flex-col items-center justify-center'
								: 'bg-white text-[#1C1917] shadow-md hover:shadow-lg'
						}`}
						style={{ animationDelay: `${0.15 * (idx + 1)}s`, animationFillMode: 'forwards' }}
					>
						<div className={`text-3xl md:text-4xl mb-3 ${stat.highlight ? 'text-white' : 'text-accent'}`}>
							{stat.icon}
						</div>
						<div className={`font-display text-3xl md:text-4xl font-bold mb-1 ${stat.highlight ? 'text-white' : 'text-[#1C1917]'}`}>
							{stat.value}
						</div>
						<div className={`text-sm md:text-base ${stat.highlight ? 'text-white/85' : 'text-[#78716C]'}`}>
							{stat.label}
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default StatsSection;
