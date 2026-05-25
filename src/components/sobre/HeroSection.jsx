import React from 'react';

const HeroSection = () => {
	return (
		<section className="relative overflow-hidden bg-sand">
			<div className="geo-pattern absolute inset-0 opacity-60" />

			<div className="relative max-w-[1200px] mx-auto px-4 py-20 md:py-28">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
					<div className="animate-fade-in-up">
						<span className="inline-block text-accent font-display text-sm md:text-base tracking-widest uppercase mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
              — Desde 2020
						</span>
						<h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-[#1C1917] leading-[1.1] mb-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.25s', animationFillMode: 'forwards' }}>
              Sobre a
							<br />
							<span className="text-accent">Double E</span>
						</h1>
						<p className="font-body text-lg md:text-xl text-[#78716C] leading-relaxed max-w-lg mb-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
              Sua plataforma de confiança para descobrir e comprar os melhores produtos do mercado.
						</p>
						<div className="flex flex-wrap gap-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.55s', animationFillMode: 'forwards' }}>
							<a
								href="/produtos"
								className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-display text-base hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
							>
                Explorar Produtos
								<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
									<path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
								</svg>
							</a>
							<a
								href="/contato"
								className="inline-flex items-center gap-2 text-[#1C1917] border-2 border-[#1C1917]/20 px-8 py-4 rounded-full font-display text-base hover:border-accent hover:text-accent transition-all duration-300"
							>
                Fale Connosco
							</a>
						</div>
					</div>

					<div className="relative hidden md:flex items-center justify-center opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
						<div className="relative w-80 h-80 lg:w-96 lg:h-96">
							<div className="absolute inset-0 bg-accent/5 rounded-full animate-float-bob" />
							<div className="absolute top-8 left-8 right-8 bottom-8 border-2 border-accent/20 rounded-full" />
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="grid grid-cols-6 gap-1.5 p-8">
									{Array.from({ length: 36 }).map((_, i) => (
										<div
											key={i}
											className="w-2 h-2 rounded-full"
											style={{
												backgroundColor: i % 3 === 0 ? '#F97316' : i % 3 === 1 ? '#F97316' : '#F5F0EB',
												opacity: i % 3 === 2 ? 0.3 : 0.6 + (i % 3) * 0.2,
											}}
										/>
									))}
								</div>
							</div>
							<div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/10 rounded-full blur-xl" />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
