import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import {
	FaSearch,
	FaShoppingCart,
	FaCreditCard,
	FaTruck,
	FaCheckCircle,
	FaStore,
	FaUpload,
	FaBoxOpen,
	FaMoneyBillWave,
	FaStar,
	FaShieldAlt,
	FaHeadset,
	FaMobileAlt,
	FaArrowRight
} from 'react-icons/fa';

const ComoFunciona = () => {
	useDocumentTitle('Como Funciona - Kusumba');

	const buyerSteps = [
		{
			icon: <FaSearch className="text-xl" />,
			title: 'Busque produtos',
			description: 'Explore milhares de produtos das melhores lojas de Angola.'
		},
		{
			icon: <FaShoppingCart className="text-xl" />,
			title: 'Adicione ao carrinho',
			description: 'Selecione os produtos desejados e revise seu pedido.'
		},
		{
			icon: <FaCreditCard className="text-xl" />,
			title: 'Pagamento seguro',
			description: 'Pague com segurança usando múltiplas formas de pagamento.'
		},
		{
			icon: <FaTruck className="text-xl" />,
			title: 'Receba em casa',
			description: 'Acompanhe sua entrega e receba no conforto da sua casa.'
		}
	];

	const sellerSteps = [
		{
			icon: <FaStore className="text-xl" />,
			title: 'Crie sua loja',
			description: 'Registe-se e configure sua loja virtual gratuitamente.'
		},
		{
			icon: <FaUpload className="text-xl" />,
			title: 'Cadastre produtos',
			description: 'Adicione fotos, descrições e preços dos seus produtos.'
		},
		{
			icon: <FaBoxOpen className="text-xl" />,
			title: 'Receba pedidos',
			description: 'Gerencie pedidos e prepare para envio.'
		},
		{
			icon: <FaMoneyBillWave className="text-xl" />,
			title: 'Receba pagamentos',
			description: 'Receba o valor das vendas na sua conta bancária.'
		}
	];

	const features = [
		{
			icon: <FaShieldAlt className="text-2xl text-orange-500" />,
			title: 'Compra protegida',
			description: 'Seu dinheiro só é liberado ao vendedor após confirmar o recebimento.'
		},
		{
			icon: <FaHeadset className="text-2xl text-orange-500" />,
			title: 'Suporte dedicado',
			description: 'Equipe disponível para ajudar em caso de dúvidas ou problemas.'
		},
		{
			icon: <FaMobileAlt className="text-2xl text-orange-500" />,
			title: 'App mobile',
			description: 'Compre e venda de qualquer lugar através do nosso aplicativo.'
		},
		{
			icon: <FaStar className="text-2xl text-orange-500" />,
			title: 'Avaliações reais',
			description: 'Sistema de avaliações para garantir transparência nas negociações.'
		}
	];

	const protectedSteps = [
		{
			number: '1',
			title: 'Você paga',
			description: 'O valor fica guardado em nossa plataforma'
		},
		{
			number: '2',
			title: 'Vendedor envia',
			description: 'O vendedor é notificado e envia o produto'
		},
		{
			number: '3',
			title: 'Você confirma',
			description: 'Após receber, confirma e o vendedor recebe'
		}
	];

	const stats = [
		{ value: '50K+', label: 'Usuários cadastrados' },
		{ value: '100K+', label: 'Produtos disponíveis' },
		{ value: '5K+', label: 'Vendedores ativos' },
		{ value: '98%', label: 'Avaliação positiva' }
	];

	const buyerTips = [
		'Verifique a avaliação do vendedor antes de comprar',
		'Leia as descrições dos produtos atentamente',
		'Use sempre o sistema de mensagens da plataforma',
		'Confirme o recebimento antes de liberar o pagamento',
		'Em caso de problemas, contacte nosso suporte'
	];

	const sellerTips = [
		'Seja honesto nas descrições dos produtos',
		'Use fotos reais e de qualidade',
		'Envie os produtos dentro do prazo combinado',
		'Mantenha comunicação clara com os compradores',
		'Embale bem os produtos para evitar danos'
	];

	const sellerAdvantages = [
		'Acesso a mais de 50.000 clientes',
		'Painel de gestão completo',
		'Pagamentos garantidos',
		'Sem custo fixo mensal',
		'Suporte especializado'
	];

	const categories = [
		{ name: 'Tecnologia', icon: '💻', count: '5.000+' },
		{ name: 'Moda', icon: '👕', count: '3.500+' },
		{ name: 'Casa & Móveis', icon: '🏠', count: '2.800+' },
		{ name: 'Beleza & Saúde', icon: '💄', count: '2.200+' },
		{ name: 'Esportes', icon: '⚽', count: '1.500+' },
		{ name: 'Livros', icon: '📚', count: '1.000+' }
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
							Como Funciona a <span className="text-orange-400">Kusumba</span>
						</h1>
						<p className="vender-stagger text-orange-100/80 text-base md:text-lg max-w-2xl leading-relaxed" style={{ animationDelay: '200ms' }}>
							Descubra como comprar e vender de forma simples, segura e rápida na maior plataforma de e-commerce de Angola.
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
						<div className="bg-white rounded-xl border border-orange-100/40 shadow-sm p-5" style={{ animationDelay: '500ms' }}>
							<h4 className="font-bold text-gray-900 mb-3 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>Categorias disponíveis</h4>
							<div className="grid grid-cols-2 gap-2">
								{categories.map((cat, index) => (
									<div key={index} className="flex items-center gap-2 p-2.5 bg-orange-50/50 rounded-lg">
										<span className="text-base">{cat.icon}</span>
										<div>
											<div className="text-xs font-medium text-gray-800">{cat.name}</div>
											<div className="text-[10px] text-gray-400">{cat.count}</div>
										</div>
									</div>
								))}
							</div>
						</div>
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
						<div className="bg-white rounded-xl border border-orange-100/40 shadow-sm p-5" style={{ animationDelay: '600ms' }}>
							<h4 className="font-bold text-gray-900 mb-3 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>Vantagens de vender</h4>
							<ul className="space-y-2">
								{sellerAdvantages.map((item, index) => (
									<li key={index} className="flex items-center gap-2">
										<FaCheckCircle className="text-green-500 flex-shrink-0 text-xs" />
										<span className="text-gray-600 text-xs">{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* ═══ Benefits Section ═══ */}
			<section className="bg-[#f5f0eb] py-20">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="text-center mb-14">
						<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Porquê Nós</span>
						<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Por que usar a Kusumba?
						</h2>
						<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
							Recursos que tornam sua experiência única e segura
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						{features.map((feature, index) => (
							<div
								key={index}
								className="vender-stagger vender-card-hover bg-white rounded-xl border border-orange-100/50 p-8 text-center shadow-sm"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-sm">
									{feature.icon}
								</div>
								<h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>{feature.title}</h3>
								<p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══ Compra Protegida ═══ */}
			<section className="relative bg-gradient-to-br from-orange-600 to-orange-700 py-16 md:py-20 overflow-hidden">
				<div className="vender-stats-pattern absolute inset-0 pointer-events-none" />
				<div className="max-w-[1200px] mx-auto px-4 relative z-10">
					<div className="text-center mb-12">
						<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Compra Protegida Kusumba
						</h2>
						<p className="vender-stagger text-orange-100/70 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
							Seu dinheiro fica seguro até você receber o produto
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{protectedSteps.map((step, index) => (
							<div
								key={index}
								className="vender-stagger relative bg-white/10 backdrop-blur-md rounded-xl border border-white/10 p-7 text-center vender-card-hover"
								style={{ animationDelay: `${index * 120 + 300}ms` }}
							>
								<span className="vender-step-number text-orange-300/50">{step.number}</span>
								<div className="relative z-10">
									<div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-5">
										<span className="text-white font-bold text-xl">{step.number}</span>
									</div>
									<h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: '"Fredoka", sans-serif' }}>{step.title}</h3>
									<p className="text-orange-100/70 text-sm leading-relaxed">{step.description}</p>
								</div>
							</div>
						))}
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

			{/* ═══ Statistics Section ═══ */}
			<section className="relative bg-gradient-to-br from-orange-600 to-orange-700 py-16 md:py-20 overflow-hidden">
				<div className="vender-stats-pattern absolute inset-0 pointer-events-none" />
				<div className="max-w-[1200px] mx-auto px-4 relative z-10">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
						{stats.map((stat, i) => (
							<div key={i} className="vender-stagger" style={{ animationDelay: `${i * 100}ms` }}>
								<div className="text-4xl md:text-5xl font-bold mb-2" style={{ fontFamily: '"Fredoka", sans-serif' }}>{stat.value}</div>
								<div className="text-orange-100/70 text-sm font-medium tracking-wide">{stat.label}</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══ Final CTA ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="vender-stagger relative bg-gradient-to-br from-orange-600 via-orange-600 to-orange-700 text-white rounded-2xl p-12 md:p-16 text-center shadow-xl overflow-hidden" style={{ animationDelay: '0ms' }}>
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none" />
					<div className="vender-hero-pattern absolute inset-0 pointer-events-none" />

					<div className="relative z-10">
						<h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: '"Fredoka", sans-serif' }}>
							Comece agora mesmo
						</h2>
						<p className="text-lg mb-8 text-orange-100/80 max-w-2xl mx-auto leading-relaxed">
							Junte-se à Kusumba e faça parte da maior comunidade de compras e vendas de Angola.
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
