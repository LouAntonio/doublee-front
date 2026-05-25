import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import {
	FaStore,
	FaPercent,
	FaShieldAlt,
	FaChartLine,
	FaUsers,
	FaMoneyBillWave,
	FaTruck,
	FaCheckCircle,
	FaStar,
	FaRocket,
	FaBoxOpen,
	FaHandshake,
	FaArrowRight
} from 'react-icons/fa';

const Vender = () => {
	useDocumentTitle('Venda Connosco - Kusumba');
	const { isAuthenticated } = useAuthStore();
	const navigate = useNavigate();

	const handleComecarVender = () => {
		if (isAuthenticated) {
			navigate('/loja/dashboard');
		} else {
			navigate('/auth');
		}
	};

	const benefits = [
		{
			icon: <FaStore className="text-3xl text-orange-500" />,
			title: 'Sua Loja Virtual',
			description: 'Tenha sua própria loja dentro da maior plataforma de e-commerce de Angola.'
		},
		{
			icon: <FaUsers className="text-3xl text-orange-500" />,
			title: 'Milhões de Clientes',
			description: 'Acesse uma base com mais de 50.000 clientes ativos a procura dos seus produtos.'
		},
		{
			icon: <FaShieldAlt className="text-3xl text-orange-500" />,
			title: 'Segurança Total',
			description: 'Transações seguras e proteção contra fraudes para vender com total tranquilidade.'
		},
		{
			icon: <FaChartLine className="text-3xl text-orange-500" />,
			title: 'Ferramentas de Gestão',
			description: 'Dashboard completo para gerir produtos, vendas e desempenho da sua loja.'
		},
		{
			icon: <FaMoneyBillWave className="text-3xl text-orange-500" />,
			title: 'Pagamento Garantido',
			description: 'Receba as suas vendas de forma rápida e segura, sem burocracia nem surpresas.'
		},
		{
			icon: <FaTruck className="text-3xl text-orange-500" />,
			title: 'Logística Simplificada',
			description: 'Você cuida da entrega e nós tratamos de conectar os seus produtos aos clientes certos.'
		}
	];

	const stats = [
		{ value: '50K+', label: 'Clientes Ativos' },
		{ value: '5K+', label: 'Vendedores' },
		{ value: '100K+', label: 'Produtos Vendidos' },
		{ value: '98%', label: 'Satisfação' }
	];

	const steps = [
		{
			number: '01',
			title: 'Crie sua conta',
			description: 'Registe-se na Kusumba e aceda ao painal do vendedor gratuitamente.',
			icon: <FaCheckCircle className="text-xl" />
		},
		{
			number: '02',
			title: 'Cadastre sua loja',
			description: 'Preencha as informações do seu negócio e aguarde a aprovação da equipa.',
			icon: <FaStore className="text-xl" />
		},
		{
			number: '03',
			title: 'Adicione produtos',
			description: 'Cadastre os seus produtos com fotos, descrições detalhadas e preços competitivos.',
			icon: <FaBoxOpen className="text-xl" />
		},
		{
			number: '04',
			title: 'Comece a vender',
			description: 'Receba pedidos, faça as entregas e receba os pagamentos direto na sua conta.',
			icon: <FaRocket className="text-xl" />
		}
	];

	const requirements = [
		'Cópia do BI ou Passaporte válido',
		'NUIT (Número de Identificação Fiscal)',
		'Comprovativo de morada atualizado',
		'Conta bancária para recebimentos',
		'Produtos em conformidade com a lei angolana'
	];

	const commissions = [
		{ category: 'Eletrônicos', rate: '8%' },
		{ category: 'Moda & Acessórios', rate: '12%' },
		{ category: 'Casa & Decoração', rate: '10%' },
		{ category: 'Beleza & Saúde', rate: '10%' },
		{ category: 'Outros', rate: '15%' }
	];

	const testimonials = [
		{
			name: 'Carlos Mendes',
			store: 'TechMundo Angola',
			text: 'A Kusumba transformou o meu negócio. Em 6 meses tripliquei as minhas vendas e alcancei clientes em todo o país.',
			rating: 5
		},
		{
			name: 'Ana Paula Soares',
			store: 'Moda & Estilo',
			text: 'A plataforma é intuitiva e o suporte é simplesmente excelente. Recomendo a qualquer empreendedor que queira crescer.',
			rating: 5
		},
		{
			name: 'João Baptista',
			store: 'Casa & Decoração',
			text: 'Comecei sozinho e hoje tenho uma equipa dedicada. A Kusumba foi fundamental em cada etapa dessa travessia.',
			rating: 5
		}
	];

	const faqs = [
		{
			question: 'Quanto custa vender na Kusumba?',
			answer: 'O cadastro é totalmente gratuito! Cobramos apenas uma pequena comissão quando realiza uma venda. As taxas variam por categoria de produto.'
		},
		{
			question: 'Quanto tempo leva a aprovação da loja?',
			answer: 'Após enviar toda a documentação necessária, a nossa equipa analisa e aprova em até 48 horas úteis.'
		},
		{
			question: 'Como recebo os pagamentos?',
			answer: 'Os pagamentos são depositados na sua conta bancária cadastrada em até 5 dias úteis após a confirmação da entrega ao cliente.'
		},
		{
			question: 'Posso vender qualquer tipo de produto?',
			answer: 'Os produtos devem estar em conformidade com a legislação angolana. Não permitimos artigos ilegais, falsificados ou proibidos pela lei.'
		},
		{
			question: 'Preciso de ter stock próprio?',
			answer: 'Sim, você é responsável pelo seu stock e pelo envio dos produtos aos clientes após a confirmação da venda.'
		}
	];

	return (
		<div className="min-h-screen bg-[#faf8f6] flex flex-col">
			<Header />

			{/* ═══ Hero Section ═══ */}
			<div className="max-w-[1200px] mx-auto px-4 w-full">
				<section className="relative mt-4 bg-gradient-to-b from-[#1a0a00] via-[#2d1300] to-[#3d1a00] text-white rounded-2xl overflow-hidden shadow-2xl">
					{/* SVG Waves */}
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

					{/* Radial glow */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-orange-500/20 rounded-full blur-[150px] pointer-events-none" />
					<div className="vender-hero-pattern absolute inset-0 pointer-events-none" />

					<div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-14 gap-6">
						<div className="flex-1 text-center md:text-left">
							<div className="vender-stagger inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 rounded-full px-4 py-1.5 text-orange-200 text-xs font-semibold uppercase tracking-wider mb-5" style={{ animationDelay: '0ms' }}>
								<span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping-soft" />
							Para Vendedores Angolanos
							</div>
							<h1 className="vender-stagger text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-[1.1]" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Venda na  <span className="text-orange-400">Kusumba</span>
							</h1>
							<p className="vender-stagger text-orange-100/80 text-base md:text-lg max-w-xl leading-relaxed mb-8" style={{ animationDelay: '200ms' }}>
							Junte-se a milhares de vendedores e transforme o seu negócio com a maior plataforma de e-commerce de Angola.
							</p>
							<div className="vender-stagger flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start" style={{ animationDelay: '300ms' }}>
								<button
									onClick={handleComecarVender}
									className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 inline-flex items-center gap-2 cursor-pointer"
								>
								Começar a Vender
									<FaArrowRight />
								</button>
								<div className="flex items-center gap-2 text-orange-200/70 text-sm">
									<FaCheckCircle className="text-orange-400" />
									<span>Cadastro 100% gratuito</span>
								</div>
							</div>
						</div>

						{/* Stats Preview */}
						<div className="vender-stagger flex flex-col gap-3 w-full md:w-auto" style={{ animationDelay: '250ms' }}>
							<div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 text-center min-w-[220px]">
								<div className="text-3xl font-bold text-orange-300" style={{ fontFamily: '"Fredoka", sans-serif' }}>5K+</div>
								<div className="text-orange-100/60 text-xs uppercase tracking-widest mt-1">Vendedores Ativos</div>
							</div>
							<div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-5 text-center min-w-[220px]">
								<div className="text-3xl font-bold text-orange-300" style={{ fontFamily: '"Fredoka", sans-serif' }}>50K+</div>
								<div className="text-orange-100/60 text-xs uppercase tracking-widest mt-1">Clientes na Plataforma</div>
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* ═══ Benefits Section ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="text-center mb-14">
					<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Porquê Nós</span>
					<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
						Por que vender na Kusumba?
					</h2>
					<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
						Oferecemos tudo o que precisa para levar o seu negócio ao próximo nível
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{benefits.map((benefit, index) => (
						<div
							key={index}
							className="vender-stagger vender-card-hover bg-white rounded-xl border border-orange-100/50 p-8 shadow-sm"
							style={{ animationDelay: `${index * 80}ms` }}
						>
							<div className="w-14 h-14 bg-orange-50 rounded-xl flex items-center justify-center mb-5">
								{benefit.icon}
							</div>
							<h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>{benefit.title}</h3>
							<p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
						</div>
					))}
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

			{/* ═══ How It Works ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="text-center mb-14">
					<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Passo a Passo</span>
					<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
						Comece a vender em 4 passos
					</h2>
					<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
						Um processo simples e rápido para lançar o seu negócio online
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					{steps.map((step, index) => (
						<div key={index} className="vender-stagger relative" style={{ animationDelay: `${index * 120}ms` }}>
							{index < steps.length - 1 && (
								<div className="hidden lg:block absolute top-14 left-[60%] w-[calc(100%+0.5rem)] h-px bg-gradient-to-r from-orange-300 to-orange-200/30" />
							)}
							<div className="relative bg-white rounded-xl border border-orange-100/40 shadow-sm p-7 text-center vender-card-hover overflow-hidden">
								<span className="vender-step-number">{step.number}</span>
								<div className="relative z-10">
									<div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-5 text-orange-500 shadow-sm shadow-orange-200/50">
										{step.icon}
									</div>
									<div className="text-orange-500 font-bold text-xs tracking-[0.15em] mb-2">PASSO {step.number}</div>
									<h3 className="text-base font-bold text-gray-900 mb-2" style={{ fontFamily: '"Fredoka", sans-serif' }}>{step.title}</h3>
									<p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ═══ Requirements + Commission ═══ */}
			<section className="bg-[#f5f0eb] py-20">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="text-center mb-14">
						<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Documentação</span>
						<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Documentação necessária
						</h2>
						<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
							Para garantir a segurança e confiança de todos, solicitamos os seguintes documentos
						</p>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
						<div className="vender-stagger bg-white rounded-xl border border-orange-100/40 shadow-sm p-8" style={{ animationDelay: '100ms' }}>
							<h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								<FaHandshake className="text-orange-500 text-xl" />
								Documentos exigidos
							</h3>
							<ul className="space-y-4">
								{requirements.map((req, index) => (
									<li key={index} className="flex items-start gap-3">
										<FaCheckCircle className="text-green-500 mt-0.5 flex-shrink-0 text-sm" />
										<span className="text-gray-600 text-sm">{req}</span>
									</li>
								))}
							</ul>
						</div>

						<div className="vender-stagger bg-white rounded-xl border border-orange-100/40 shadow-sm p-8" style={{ animationDelay: '200ms' }}>
							<h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-3" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								<FaPercent className="text-orange-500 text-xl" />
								Comissão por venda
							</h3>
							<div className="space-y-1">
								{commissions.map((item, i) => (
									<div
										key={i}
										className={`flex justify-between items-center py-3 ${i < commissions.length - 1 ? 'border-b border-gray-100' : ''}`}
									>
										<span className="text-gray-600 text-sm">{item.category}</span>
										<span className="font-bold text-gray-900" style={{ fontFamily: '"Fredoka", sans-serif' }}>{item.rate}</span>
									</div>
								))}
							</div>
							<p className="text-xs text-gray-400 mt-6 leading-relaxed">
								* Valores sujeitos a alteração. Consulte os termos completos no momento do cadastro.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* ═══ Testimonials ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="text-center mb-14">
					<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Depoimentos</span>
					<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
						Histórias de sucesso
					</h2>
					<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
						Vendedores que cresceram connosco e transformaram os seus negócios
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="vender-stagger vender-card-hover bg-white rounded-xl border border-orange-100/40 shadow-sm p-8 relative"
							style={{ animationDelay: `${index * 120}ms` }}
						>
							{/* Decorative quote */}
							<div className="absolute top-4 right-5 text-orange-200/30 text-6xl leading-none select-none" style={{ fontFamily: '"Fredoka", sans-serif' }}>"</div>
							<div className="flex text-yellow-400 mb-4 relative z-10">
								{[...Array(testimonial.rating)].map((_, i) => (
									<FaStar key={i} className="text-sm" />
								))}
							</div>
							<p className="text-gray-600 mb-6 italic leading-relaxed text-sm relative z-10">"{testimonial.text}"</p>
							<div className="flex items-center relative z-10">
								<div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-base mr-3 shadow-sm">
									{testimonial.name.charAt(0)}
								</div>
								<div>
									<div className="font-semibold text-gray-900 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>{testimonial.name}</div>
									<div className="text-xs text-gray-400">{testimonial.store}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* ═══ FAQ ═══ */}
			<section className="bg-[#f5f0eb] py-20">
				<div className="max-w-[800px] mx-auto px-4">
					<div className="text-center mb-14">
						<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>FAQ</span>
						<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Perguntas frequentes
						</h2>
						<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
							Tire as suas dúvidas sobre como vender na Kusumba
						</p>
					</div>

					<div className="vender-stagger space-y-3" style={{ animationDelay: '300ms' }}>
						{faqs.map((faq, index) => (
							<details key={index} className="bg-white rounded-xl border border-orange-100/30 shadow-sm group overflow-hidden">
								<summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-orange-50/50 transition-colors">
									<h3 className="font-semibold text-gray-800 text-sm pr-4">{faq.question}</h3>
									<span className="text-orange-500 text-2xl leading-none group-open:rotate-45 transition-transform duration-300 flex-shrink-0">+</span>
								</summary>
								<div className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-orange-50 pt-4">
									{faq.answer}
								</div>
							</details>
						))}
					</div>
				</div>
			</section>

			{/* ═══ Final CTA ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="vender-stagger relative bg-gradient-to-br from-orange-600 via-orange-600 to-orange-700 text-white rounded-2xl p-12 md:p-16 text-center shadow-xl overflow-hidden" style={{ animationDelay: '0ms' }}>
					{/* Decorative glow */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-400/20 rounded-full blur-[100px] pointer-events-none" />
					<div className="vender-hero-pattern absolute inset-0 pointer-events-none" />

					<div className="relative z-10">
						<h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: '"Fredoka", sans-serif' }}>
							Pronto para começar a vender?
						</h2>
						<p className="text-lg mb-8 text-orange-100/80 max-w-2xl mx-auto leading-relaxed">
							Junte-se à maior comunidade de compradores e vendedores de Angola e leve o seu negócio para o próximo nível.
						</p>
						<button
							onClick={handleComecarVender}
							className="bg-white text-orange-600 hover:bg-orange-50 active:bg-gray-100 px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02] inline-flex items-center gap-2 cursor-pointer"
						>
							Criar minha loja grátis
							<FaArrowRight />
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Vender;
