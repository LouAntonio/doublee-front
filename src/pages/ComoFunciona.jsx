import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import {
	FaUserPlus,
	FaSearch,
	FaShoppingCart,
	FaClipboardCheck,
	FaMoneyBillWave,
	FaTruck,
	FaStore,
	FaIdCard,
	FaBoxOpen,
	FaHandshake,
	FaWarehouse,
	FaCreditCard,
	FaFileUpload,
	FaCheckCircle,
	FaArrowRight
} from 'react-icons/fa';

const ComoFunciona = () => {
	useDocumentTitle('Como Funciona - Kuvangana');

	const buyerSteps = [
		{
			icon: <FaUserPlus className="text-xl" />,
			title: 'Cria a tua conta',
			description: 'Regista-te ou inicia sessão — precisas de conta para finalizar compras.'
		},
		{
			icon: <FaSearch className="text-xl" />,
			title: 'Explora o catálogo',
			description: 'Pesquisa produtos, navega por categorias, promoções, cupões e lojas verificadas.'
		},
		{
			icon: <FaShoppingCart className="text-xl" />,
			title: 'Adiciona ao carrinho',
			description: 'Reúne os produtos num pedido e revê quantidades antes de avançar.'
		},
		{
			icon: <FaClipboardCheck className="text-xl" />,
			title: 'Finaliza a compra',
			description: 'No checkout escolhes a entrega à morada (com custo por zona) ou o levantamento na sede.'
		},
		{
			icon: <FaMoneyBillWave className="text-xl" />,
			title: 'Paga com segurança',
			description: 'Multicaixa Express ou Transferência Bancária, com coordenadas fornecidas na página de pagamento.'
		},
		{
			icon: <FaTruck className="text-xl" />,
			title: 'Recebe e acompanha',
			description: 'No painel de cliente segues o estado do pagamento e da entrega do teu pedido.'
		}
	];

	const sellerSteps = [
		{
			icon: <FaUserPlus className="text-xl" />,
			title: 'Cria a tua conta',
			description: 'Regista-te na Kuvangana para aceder ao painel de vendedor.'
		},
		{
			icon: <FaIdCard className="text-xl" />,
			title: 'Verifica a identidade',
			description: 'Submete o BI (frente e verso) ou Passaporte e 3 selfies. A equipa analisa e aprova antes de criares a tua loja.'
		},
		{
			icon: <FaStore className="text-xl" />,
			title: 'Cria a tua loja',
			description: 'Regista os dados do teu negócio no painel de vendedor, após verificação concluída.'
		},
		{
			icon: <FaBoxOpen className="text-xl" />,
			title: 'Adiciona produtos',
			description: 'Cadastra fotos, preços e descrições. Os produtos são aprovados antes de ficarem visíveis.'
		},
		{
			icon: <FaHandshake className="text-xl" />,
			title: 'Gere pedidos e recebe',
			description: 'Recebes pedidos, fazes a entrega (zona ou sede) e recebes o pagamento confirmado.'
		}
	];

	const deliveryItems = [
		{
			icon: <FaTruck className="text-xl" />,
			title: 'Entrega ao Domicílio',
			description: 'Escolhes a tua zona de entrega no checkout e o custo é calculado por zona.'
		},
		{
			icon: <FaWarehouse className="text-xl" />,
			title: 'Levantamento na Sede',
			description: 'Os vendedores fazem chegar os produtos à sede da Kuvangana e tu levantas pessoalmente.'
		}
	];

	const paymentItems = [
		{
			icon: <FaCreditCard className="text-xl" />,
			title: 'Multicaixa Express',
			description: 'Pagamento rápido a partir do teu telemóvel.'
		},
		{
			icon: <FaMoneyBillWave className="text-xl" />,
			title: 'Transferência Bancária',
			description: 'Pagamento por IBAN via balcão, ATM ou aplicações de internet banking.'
		},
		{
			icon: <FaFileUpload className="text-xl" />,
			title: 'Comprovativo',
			description: 'Envias o comprovativo no checkout ou depois pelo painel para a equipa validar o pagamento.'
		}
	];

	const buyerTips = [
		'Verifica a avaliação e o estado da loja antes de comprar',
		'Lê atentamente a descrição e as fotografias do produto',
		'Confirma os dados de contacto da loja',
		'Guarda o comprovativo de pagamento',
		'Em caso de dúvida, contacta o nosso suporte'
	];

	const sellerTips = [
		'Mantém descrições e fotos fiéis aos produtos',
		'Cumpre os prazos e as zonas de entrega combinadas',
		'Actualiza o teu stock regularmente',
		'Comunica claramente com os compradores',
		'Responde à equipa durante o processo de verificação'
	];

	return (
		<div className="min-h-screen bg-[#faf8f6] flex flex-col">
			<Header />

			{/* ═══ Hero Section ═══ */}
			<div className="max-w-[1200px] mx-auto px-4 w-full">
				<section className="relative mt-4 bg-gradient-to-b from-[#1a0a00] via-[#2d1300] to-[#3d1a00] text-white rounded-2xl overflow-hidden shadow-2xl">
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<svg className="vender-wave absolute -top-10 -left-10 w-[120%] h-auto opacity-[0.07]" viewBox="0 0 1440 320" preserveAspectRatio="none">
							<path fill="#F97316" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
						</svg>
						<svg className="vender-wave-delayed absolute -bottom-10 -right-10 w-[120%] h-auto opacity-[0.05]" viewBox="0 0 1440 320" preserveAspectRatio="none">
							<path fill="#F97316" d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,186.7C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
						</svg>
						<svg className="vender-wave absolute top-1/2 -translate-y-1/2 w-full h-auto opacity-[0.03]" viewBox="0 0 1440 400" preserveAspectRatio="none">
							<path fill="#F97316" d="M0,200 C360,100 1080,300 1440,200 L1440,400 L0,400Z"/>
						</svg>
					</div>

					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/20 rounded-full blur-[150px] pointer-events-none" />
					<div className="vender-hero-pattern absolute inset-0 pointer-events-none" />

					<div className="relative z-10 flex flex-col items-center justify-center px-6 md:px-10 py-16 md:py-20 text-center">
						<h1 className="vender-stagger text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight leading-[1.1]" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Como Funciona a <span className="text-orange-400">Kuvangana</span>
						</h1>
						<p className="vender-stagger text-orange-100/80 text-base md:text-lg max-w-2xl leading-relaxed" style={{ animationDelay: '200ms' }}>
							Comprar e vender de forma simples e segura: um mercado digital angolano com lojas verificadas e pagamento validado.
						</p>
					</div>
				</section>
			</div>

			{/* ═══ Buyer + Seller Steps ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="text-center mb-14">
					<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Como Funciona</span>
					<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
						Para compradores e vendedores
					</h2>
					<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
						Duas experiências, uma plataforma. Tudo pensado para si.
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Compradores */}
					<div className="vender-stagger space-y-6" style={{ animationDelay: '100ms' }}>
						<div className="flex items-center gap-4 mb-6">
							<div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
								<FaShoppingCart className="text-xl" />
							</div>
							<h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: '"Fredoka", sans-serif' }}>Para Compradores</h3>
						</div>
						{buyerSteps.map((step, index) => (
							<div key={index} className="flex gap-4 bg-white rounded-xl border border-orange-100/40 shadow-sm p-5 vender-card-hover" style={{ animationDelay: `${150 + index * 80}ms` }}>
								<div className="flex-shrink-0 w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
									{step.icon}
								</div>
								<div>
									<h4 className="font-bold text-gray-900 mb-0.5 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>{step.title}</h4>
									<p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
								</div>
							</div>
						))}
					</div>

					{/* Vendedores */}
					<div className="vender-stagger space-y-6" style={{ animationDelay: '200ms' }}>
						<div className="flex items-center gap-4 mb-6">
							<div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
								<FaStore className="text-xl" />
							</div>
							<h3 className="text-xl font-bold text-gray-900" style={{ fontFamily: '"Fredoka", sans-serif' }}>Para Vendedores</h3>
						</div>
						{sellerSteps.map((step, index) => (
							<div key={index} className="flex gap-4 bg-white rounded-xl border border-orange-100/40 shadow-sm p-5 vender-card-hover" style={{ animationDelay: `${250 + index * 80}ms` }}>
								<div className="flex-shrink-0 w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 shadow-sm">
									{step.icon}
								</div>
								<div>
									<h4 className="font-bold text-gray-900 mb-0.5 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>{step.title}</h4>
									<p className="text-gray-500 text-xs leading-relaxed">{step.description}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══ Entrega & Pagamento ═══ */}
			<section className="bg-[#f5f0eb] py-20">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="text-center mb-14">
						<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Entrega &amp; Pagamento</span>
						<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Como recebes e pagas
						</h2>
						<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
							Entrega ao domicílio ou levantamento na sede, com pagamento validado pela equipa.
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Entrega */}
						<div className="vender-stagger bg-white rounded-xl border border-orange-100/50 shadow-sm p-8" style={{ animationDelay: '100ms' }}>
							<h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								<FaTruck className="text-orange-500 text-xl" />
								Entrega
							</h3>
							<div className="space-y-5">
								{deliveryItems.map((item, index) => (
									<div key={index} className="flex gap-4 p-4 bg-orange-50/50 rounded-xl">
										<div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shadow-sm">
											{item.icon}
										</div>
										<div>
											<h4 className="font-bold text-gray-800 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>{item.title}</h4>
											<p className="text-gray-500 text-xs leading-relaxed mt-1">{item.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>

						{/* Pagamento */}
						<div className="vender-stagger bg-white rounded-xl border border-orange-100/50 shadow-sm p-8" style={{ animationDelay: '200ms' }}>
							<h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								<FaCreditCard className="text-orange-500 text-xl" />
								Pagamento
							</h3>
							<div className="space-y-5">
								{paymentItems.map((item, index) => (
									<div key={index} className="flex gap-4 p-4 bg-orange-50/50 rounded-xl">
										<div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shadow-sm">
											{item.icon}
										</div>
										<div>
											<h4 className="font-bold text-gray-800 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>{item.title}</h4>
											<p className="text-gray-500 text-xs leading-relaxed mt-1">{item.description}</p>
										</div>
									</div>
								))}
								<div className="flex items-start gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
									<FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0 text-sm" />
									<p className="text-xs text-emerald-800 leading-relaxed">
										O pedido só é confirmado quando o pagamento é validado pela equipa.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══ Dicas de Segurança ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="text-center mb-14">
					<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Segurança</span>
					<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
						Dicas de segurança
					</h2>
					<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
						Compre e venda com tranquilidade seguindo estas recomendações
					</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="vender-stagger bg-white rounded-xl border border-orange-100/40 shadow-sm p-8" style={{ animationDelay: '100ms' }}>
						<h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>
							<div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
								<FaShoppingCart className="text-orange-500 text-sm" />
							</div>
							Para compradores
						</h3>
						<ul className="space-y-3">
							{buyerTips.map((item, index) => (
								<li key={index} className="flex items-start gap-3">
									<FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-sm" />
									<span className="text-gray-600 text-sm">{item}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="vender-stagger bg-white rounded-xl border border-orange-100/40 shadow-sm p-8" style={{ animationDelay: '200ms' }}>
						<h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>
							<div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
								<FaStore className="text-orange-500 text-sm" />
							</div>
							Para vendedores
						</h3>
						<ul className="space-y-3">
							{sellerTips.map((item, index) => (
								<li key={index} className="flex items-start gap-3">
									<FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-sm" />
									<span className="text-gray-600 text-sm">{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>

			{/* ═══ Final CTA ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 pb-20">
				<div className="vender-stagger relative bg-gradient-to-br from-orange-600 via-orange-600 to-orange-700 text-white rounded-2xl p-12 md:p-16 text-center shadow-xl overflow-hidden" style={{ animationDelay: '0ms' }}>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none" />
					<div className="vender-hero-pattern absolute inset-0 pointer-events-none" />

					<div className="relative z-10">
						<h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: '"Fredoka", sans-serif' }}>
							Comece agora mesmo
						</h2>
						<p className="text-lg mb-8 text-orange-100/80 max-w-2xl mx-auto leading-relaxed">
							Junte-se à Kuvangana e faça parte da comunidade de compras e vendas de Angola.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<a
								href="/auth"
								className="bg-white text-orange-600 hover:bg-orange-50 px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02] inline-flex items-center justify-center gap-2"
							>
								<FaShoppingCart />
								Começar a Comprar
							</a>
							<a
								href="/vender"
								className="bg-transparent border-2 border-white/30 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 inline-flex items-center justify-center gap-2 hover:bg-white/10"
							>
								<FaStore />
								Começar a Vender
								<FaArrowRight />
							</a>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
};

export default ComoFunciona;