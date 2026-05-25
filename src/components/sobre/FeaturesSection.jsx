import React from 'react';
import { FaTruck, FaShieldAlt, FaHeadset } from 'react-icons/fa';

const features = [
	{
		icon: <FaTruck />,
		title: 'Entrega Rápida',
		description: 'Garantimos que seus produtos cheguem até você com a maior agilidade possível.',
	},
	{
		icon: <FaShieldAlt />,
		title: 'Compra Segura',
		description: 'Seus dados protegidos com as mais avançadas tecnologias de segurança.',
	},
	{
		icon: <FaHeadset />,
		title: 'Suporte 24/7',
		description: 'Nossa equipe está sempre pronta para ajudar você em qualquer momento.',
	},
];

const FeaturesSection = () => {
	return (
		<section className="max-w-[1200px] mx-auto px-4 py-24 md:py-32">
			<div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
				<span className="inline-block text-accent font-display text-sm tracking-widest uppercase mb-4">
          — Porquê Nós
				</span>
				<h2 className="font-display text-3xl md:text-5xl text-[#1C1917]">
          Por que escolher a <span className="text-accent">Kusumba</span>?
				</h2>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
				{features.map((feature, idx) => (
					<div
						key={idx}
						className="group opacity-0 animate-fade-in-up text-center"
						style={{ animationDelay: `${0.2 * (idx + 1)}s`, animationFillMode: 'forwards' }}
					>
						<div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-accent text-4xl group-hover:bg-accent group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 group-hover:shadow-lg">
							{feature.icon}
						</div>
						<h3 className="font-display text-xl text-[#1C1917] mb-3 group-hover:text-accent transition-colors duration-300">
							{feature.title}
						</h3>
						<p className="font-body text-[#78716C] leading-relaxed">
							{feature.description}
						</p>
					</div>
				))}
			</div>
		</section>
	);
};

export default FeaturesSection;
