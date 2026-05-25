import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';

const LostCartIllustration = () => (
	<svg viewBox="0 0 240 180" className="w-56 h-42 md:w-72 md:h-54" aria-hidden="true">
		<defs>
			<linearGradient id="cartGrad" x1="0" y1="0" x2="1" y2="1">
				<stop offset="0%" stopColor="#F97316" stopOpacity="0.12" />
				<stop offset="100%" stopColor="#F97316" stopOpacity="0.04" />
			</linearGradient>
		</defs>

		<path
			d="M15 155 Q 55 130 80 145 Q 110 160 140 140 Q 165 125 185 135"
			stroke="#F97316"
			strokeWidth="2.5"
			strokeDasharray="6 6"
			fill="none"
			opacity="0.4"
			strokeLinecap="round"
		/>
		<circle cx="185" cy="135" r="3" fill="#F97316" opacity="0.5" />

		<rect x="102" y="72" width="78" height="54" rx="10" fill="url(#cartGrad)" stroke="#F97316" strokeWidth="2.5" />
		<line x1="115" y1="88" x2="167" y2="88" stroke="#F97316" strokeWidth="1.5" opacity="0.2" />
		<line x1="115" y1="100" x2="167" y2="100" stroke="#F97316" strokeWidth="1.5" opacity="0.2" />
		<line x1="115" y1="112" x2="150" y2="112" stroke="#F97316" strokeWidth="1.5" opacity="0.2" />

		<path d="M141 72 v-16 c0,-9 18,-9 18,0 v18" stroke="#F97316" strokeWidth="2.5" fill="none" strokeLinecap="round" />

		<circle cx="118" cy="130" r="8" fill="white" stroke="#F97316" strokeWidth="2" />
		<circle cx="118" cy="130" r="2.5" fill="#F97316" />
		<circle cx="164" cy="130" r="8" fill="white" stroke="#F97316" strokeWidth="2" />
		<circle cx="164" cy="130" r="2.5" fill="#F97316" />

		<circle cx="122" cy="90" r="4" fill="#1C1917" />
		<circle cx="152" cy="90" r="4" fill="#1C1917" />
		<circle cx="120" cy="89" r="1.8" fill="white" />
		<circle cx="150" cy="89" r="1.8" fill="white" />

		<path d="M164 83 Q168 90 164 93 Q160 90 164 83" fill="#12E58C" opacity="0.5" />

		<text x="188" y="60" fontFamily="Fredoka, sans-serif" fontSize="24" fontWeight="700" fill="#12E58C">
			?
		</text>

		<circle cx="80" cy="68" r="2.5" fill="#F97316" opacity="0.4" />
		<circle cx="195" cy="105" r="2" fill="#12E58C" opacity="0.35" />
		<circle cx="170" cy="55" r="1.8" fill="#F97316" opacity="0.3" />
	</svg>
);

const FloatingPackage = () => (
	<svg viewBox="0 0 60 60" className="w-14 h-14 md:w-18 md:h-18" aria-hidden="true">
		<rect x="10" y="20" width="40" height="35" rx="4" fill="#FEF3E2" stroke="#F97316" strokeWidth="2" />
		<line x1="30" y1="20" x2="30" y2="55" stroke="#F97316" strokeWidth="1.5" opacity="0.4" />
		<line x1="10" y1="40" x2="50" y2="40" stroke="#F97316" strokeWidth="1.5" opacity="0.4" />

		<text x="19" y="46" fontFamily="Fredoka, sans-serif" fontSize="18" fontWeight="700" fill="#F97316">
			?
		</text>

		<path d="M18 20 C14 8 20 4 30 10" stroke="#12E58C" strokeWidth="2" fill="none" strokeLinecap="round" />
		<path d="M42 20 C46 8 40 4 30 10" stroke="#12E58C" strokeWidth="2" fill="none" strokeLinecap="round" />
	</svg>
);

const NotFound = () => {
	useDocumentTitle('404 - Página não encontrada');

	return (
		<>
			<Header />
			<main className="min-h-screen bg-[#F5F2ED] flex items-center justify-center px-4 py-16">
				<div className="w-full max-w-lg mx-auto text-center">
					<div className="relative" style={{ animation: 'fade-in-up 0.6s ease-out both' }}>
						<div className="flex justify-center items-end gap-3 mb-2">
							<div className="animate-float-bob">
								<LostCartIllustration />
							</div>
							<div className="animate-float-bob" style={{ animationDelay: '0.5s' }}>
								<FloatingPackage />
							</div>
						</div>
					</div>

					<div className="font-display" style={{ animation: 'fade-in-up 0.6s ease-out 0.2s both' }}>
						<span className="text-8xl md:text-9xl font-bold text-[#F97316] leading-none tracking-tight block">
							4
							<span className="text-[#12E58C] inline-block animate-spin-slow">0</span>
							4
						</span>
					</div>

					<h1
						className="font-display text-2xl md:text-3xl font-bold text-[#1C1917] mt-4"
						style={{ animation: 'fade-in-up 0.6s ease-out 0.35s both' }}
					>
						Parece que você se perdeu no mercado!
					</h1>

					<p
						className="font-body text-[#78716C] text-base md:text-lg mt-3 leading-relaxed max-w-md mx-auto"
						style={{ animation: 'fade-in-up 0.6s ease-out 0.5s both' }}
					>
						O carrinho que você procurava deu uma volta por aí... mas não se preocupe, ainda temos
						muitas ofertas esperando por você!
					</p>

					<div
						className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8"
						style={{ animation: 'fade-in-up 0.6s ease-out 0.65s both' }}
					>
						<Link
							to="/"
							className="font-display inline-flex items-center gap-2 px-8 py-3.5 bg-[#F97316] text-white rounded-2xl text-base font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
						>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
							</svg>
							Ir para o início
						</Link>

						<button
							onClick={() => window.history.back()}
							className="font-display inline-flex items-center gap-2 px-8 py-3.5 bg-white text-[#F97316] rounded-2xl text-base font-semibold border-2 border-[#F97316]/20 hover:border-[#F97316]/40 hover:bg-[#FFF7F0] hover:scale-105 transition-all duration-300 cursor-pointer"
						>
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
								<path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
							</svg>
							Voltar
						</button>
					</div>

					<div
						className="mt-10 pt-8 border-t border-[#E5D9CC] max-w-xs mx-auto"
						style={{ animation: 'fade-in-up 0.6s ease-out 0.8s both' }}
					>
						<p className="font-body text-sm text-[#78716C] mb-4">Ou explore essas páginas:</p>
						<div className="grid grid-cols-2 gap-3">
							{[
								{ to: '/promocoes', label: 'Promoções', icon: '🎉' },
								{ to: '/categorias', label: 'Categorias', icon: '📂' },
								{ to: '/cupoes', label: 'Cupons', icon: '🏷️' },
								{ to: '/contato', label: 'Contato', icon: '✉️' },
							].map((link) => (
								<Link
									key={link.to}
									to={link.to}
									className="font-display flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-[#78716C] hover:text-[#12E58C] hover:bg-white/60 transition-all duration-200"
								>
									<span className="text-base">{link.icon}</span>
									{link.label}
								</Link>
							))}
						</div>
					</div>
				</div>
			</main>
		</>
	);
};

export default NotFound;
