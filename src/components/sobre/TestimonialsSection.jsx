import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
	{
		name: 'Maria Silva',
		role: 'Cliente há 2 anos',
		text: 'A Double E transformou minha experiência de compras online. Produtos de qualidade e entrega rápida!',
	},
	{
		name: 'João Santos',
		role: 'Empresário',
		text: 'Excelente atendimento e preços competitivos. Recomendo para todos que buscam confiabilidade.',
	},
	{
		name: 'Ana Costa',
		role: 'Designer',
		text: 'Adoro a variedade de produtos e a facilidade de navegação. Sempre encontro o que preciso!',
	},
];

const TestimonialsSection = () => {
	return (
		<section className="max-w-[1200px] mx-auto px-4 py-24 md:py-32">
			<div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
				<span className="inline-block text-accent font-display text-sm tracking-widest uppercase mb-4">
          — Depoimentos
				</span>
				<h2 className="font-display text-3xl md:text-5xl text-[#1C1917]">
          O que nossos clientes dizem
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
				{testimonials.map((t, idx) => (
					<div
						key={idx}
						className={`opacity-0 animate-fade-in-up bg-white p-8 md:p-10 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col ${
							idx === 1 ? 'md:translate-y-8' : ''
						}`}
						style={{ animationDelay: `${0.2 * (idx + 1)}s`, animationFillMode: 'forwards' }}
					>
						<FaQuoteLeft className="text-3xl text-orange-200 mb-6" />
						<p className="font-body text-[#78716C] leading-relaxed mb-8 flex-1 italic">
              &ldquo;{t.text}&rdquo;
						</p>
						<div className="flex items-center gap-4 pt-4 border-t border-orange-100">
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center text-white font-display font-bold text-lg flex-shrink-0">
								{t.name.charAt(0)}
							</div>
							<div className="flex-1">
								<div className="font-display text-[#1C1917] font-semibold">{t.name}</div>
								<div className="text-sm text-[#78716C]">{t.role}</div>
							</div>
							<div className="flex text-amber-400 gap-0.5">
								{[...Array(5)].map((_, i) => (
									<FaStar key={i} className="text-xs" />
								))}
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default TestimonialsSection;
