import React from 'react';
import { FaBullseye, FaEye, FaHeart } from 'react-icons/fa';

const items = [
	{
		icon: <FaBullseye />,
		title: 'Missão',
		text: 'Oferecer produtos de excelência com um serviço impecável, superando as expectativas de nossos clientes a cada entrega.',
		rotate: '-rotate-[1deg]',
		borderOpacity: 'border-accent',
	},
	{
		icon: <FaEye />,
		title: 'Visão',
		text: 'Ser a plataforma de e-commerce mais admirada e confiável do país, reconhecida pela inovação e responsabilidade.',
		rotate: 'rotate-0',
		borderOpacity: 'border-accent/70',
	},
	{
		icon: <FaHeart />,
		title: 'Valores',
		text: 'Ética, transparência, paixão pelo cliente, inovação constante e compromisso com a sustentabilidade.',
		rotate: 'rotate-[1deg]',
		borderOpacity: 'border-accent/40',
	},
];

const MissionSection = () => {
	return (
		<section className="bg-sand py-24 md:py-32">
			<div className="max-w-[1200px] mx-auto px-4">
				<div className="text-center mb-16 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
					<span className="inline-block text-accent font-display text-sm tracking-widest uppercase mb-4">
            — Nossa Essência
					</span>
					<h2 className="font-display text-3xl md:text-5xl text-[#1C1917]">
            O que nos move
					</h2>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
					{items.map((item, idx) => (
						<div
							key={idx}
							className={`opacity-0 animate-fade-in-up bg-white p-8 md:p-10 rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 border-t-4 ${item.borderOpacity} ${item.rotate} hover:rotate-0`}
							style={{ animationDelay: `${0.2 * (idx + 1)}s`, animationFillMode: 'forwards' }}
						>
							<div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-accent text-3xl">
								{item.icon}
							</div>
							<h3 className="font-display text-2xl text-[#1C1917] mb-4">{item.title}</h3>
							<p className="font-body text-[#78716C] leading-relaxed">{item.text}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default MissionSection;
