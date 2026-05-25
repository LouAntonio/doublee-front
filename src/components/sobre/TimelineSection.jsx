import React from 'react';

const milestones = [
	{ year: '2020', title: 'Fundação', desc: 'Double E é fundada com a missão de revolucionar o e-commerce em Angola.' },
	{ year: '2021', title: 'Expansão', desc: 'Alcançamos 10.000 clientes e expandimos nosso catálogo para mais de 5.000 produtos.' },
	{ year: '2023', title: 'Reconhecimento', desc: 'Premiados como a melhor plataforma de e-commerce em Angola.' },
	{ year: '2026', title: 'Liderança', desc: 'Mais de 50.000 clientes confiam na Double E para suas compras online.' },
];

const TimelineSection = () => {
	return (
		<section className="bg-sand py-24 md:py-32">
			<div className="max-w-[1200px] mx-auto px-4">
				<div className="text-center mb-20 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
					<span className="inline-block text-accent font-display text-sm tracking-widest uppercase mb-4">
            — Nossa Jornada
					</span>
					<h2 className="font-display text-3xl md:text-5xl text-[#1C1917]">
            Como chegámos até aqui
					</h2>
				</div>

				<div className="relative max-w-3xl mx-auto">
					<div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-orange-200 md:-translate-x-px" />

					{milestones.map((item, idx) => (
						<div
							key={idx}
							className={`relative flex items-start gap-6 md:gap-0 mb-12 md:mb-16 last:mb-0 opacity-0 animate-fade-in-up ${
								idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
							}`}
							style={{ animationDelay: `${0.2 * (idx + 1)}s`, animationFillMode: 'forwards' }}
						>
							<div className="hidden md:block md:w-1/2" />

							<div className="relative z-10 flex-shrink-0 w-16 h-16 bg-accent rounded-full flex items-center justify-center shadow-lg border-4 border-sand md:absolute md:left-1/2 md:-translate-x-1/2">
								<span className="font-display text-white font-bold text-sm">{item.year.slice(-2)}</span>
							</div>

							<div className={`flex-1 md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
								<div className="bg-white p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
									<span className="font-display text-accent text-lg font-bold">{item.year}</span>
									<h3 className="font-display text-xl text-[#1C1917] mt-1 mb-2">{item.title}</h3>
									<p className="font-body text-[#78716C] leading-relaxed">{item.desc}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default TimelineSection;
