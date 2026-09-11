import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import {
	FaStore,
	FaShieldAlt,
	FaChartLine,
	FaUsers,
	FaMoneyBillWave,
	FaTruck,
	FaCheckCircle,
	FaRocket,
	FaBoxOpen,
	FaHandshake,
	FaIdCard,
	FaArrowRight
} from 'react-icons/fa';

const Vender = () => {
	useDocumentTitle('Venda Connosco - Kuvangana');
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
			description: 'Tenha a sua própria loja dentro do mercado digital da Kuvangana.'
		},
		{
			icon: <FaUsers className="text-3xl text-orange-500" />,
			title: 'Visibilidade',
			description: 'Os seus produtos aparecem nas pesquisas, categorias e promoções da plataforma.'
		},
		{
			icon: <FaShieldAlt className="text-3xl text-orange-500" />,
			title: 'Verificação de Identidade',
			description: 'Lojas e produtos verificados pela equipa inspiram confiança ao comprador.'
		},
		{
			icon: <FaChartLine className="text-3xl text-orange-500" />,
			title: 'Painel de Gestão',
			description: 'Dashboard completo para gerir a loja, os produtos e os pedidos.'
		},
		{
			icon: <FaMoneyBillWave className="text-3xl text-orange-500" />,
			title: 'Pagamento Validado',
			description: 'Os pagamentos dos clientes são confirmados pela equipa antes de cada pedido avançar.'
		},
		{
			icon: <FaTruck className="text-3xl text-orange-500" />,
			title: 'Entrega Flexível',
			description: 'Combine com o comprador a entrega à morada ou o levantamento na sede.'
		}
	];

	const steps = [
		{
			number: '01',
			title: 'Crie a sua conta',
			description: 'Registe-se na Kuvangana e aceda ao painel de vendedor.',
			icon: <FaCheckCircle className="text-xl" />
		},
		{
			number: '02',
			title: 'Verifique a identidade',
			description: 'Submeta o BI (frente e verso) ou Passaporte e 3 selfies. A equipa analisa e aprova antes de poder criar a loja.',
			icon: <FaIdCard className="text-xl" />
		},
		{
			number: '03',
			title: 'Crie a sua loja',
			description: 'Preencha os dados do seu negócio no painel de vendedor, após verificação concluída.',
			icon: <FaStore className="text-xl" />
		},
		{
			number: '04',
			title: 'Adicione produtos',
			description: 'Cadastre fotos, descrições e preços. Os produtos são aprovados antes de ficarem visíveis.',
			icon: <FaBoxOpen className="text-xl" />
		},
		{
			number: '05',
			title: 'Gere pedidos e receba',
			description: 'Receba pedidos, faça as entregas (zona ou sede) e receba o pagamento confirmado.',
			icon: <FaRocket className="text-xl" />
		}
	];

	const requirements = [
		'Cópia do BI (frente e verso) ou Passaporte válido',
		'3 selfies para verificação',
		'Produtos em conformidade com a lei angolana'
	];

	const paymentInfo = [
		{
			title: 'Sem taxas de adesão',
			description: 'Criar a conta e a loja é gratuito. As condições de venda são apresentadas no momento do registo da loja.'
		},
		{
			title: 'Comprovativos validados',
			description: 'Recebe pedidos, faz a entrega combinada e o pagamento é confirmado quando o comprovativo é validado pela equipa.'
		},
		{
			title: 'Um único mercado',
			description: 'Todos os pedidos e pagamentos são acompanhados no painel de vendedor, num só lugar.'
		}
	];

	const faqs = [
		{
			question: 'Quanto custa vender na Kuvangana?',
			answer: 'Criar a conta e a loja é totalmente gratuito. As condições e taxas de venda são apresentadas no momento do registo da loja.'
		},
		{
			question: 'Quanto tempo demora a verificação?',
			answer: 'Após enviar a documentação, a nossa equipa analisa o pedido. Enquanto a verificação estiver em análise, não é possível vender.'
		},
		{
			question: 'Como recebo os pagamentos?',
			answer: 'O cliente paga por Multicaixa Express ou Transferência Bancária e envia o comprovativo. Quando o pagamento é validado pela equipa, o pedido é confirmado.'
		},
		{
			question: 'Posso vender qualquer tipo de produto?',
			answer: 'Os produtos devem estar em conformidade com a legislação angolana. Não permitimos artigos ilegais, falsificados ou proibidos pela lei, e cada produto passa por aprovação.'
		},
		{
			question: 'Como são feitas as entregas?',
			answer: 'A entrega pode ser à morada do comprador dentro da zona de entrega escolhida, ou através do levantamento na sede da Kuvangana, conforme combinado.'
		},
		{
			question: 'Preciso de ter stock próprio?',
			answer: 'Sim, é responsável pelo seu stock e pelo envio dos produtos aos clientes após a confirmação do pedido.'
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

					<div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-14 gap-8">
						<div className="flex-1 text-center md:text-left">
							<div className="vender-stagger inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 rounded-full px-4 py-1.5 text-orange-200 text-xs font-semibold uppercase tracking-wider mb-5" style={{ animationDelay: '0ms' }}>
								<span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping-soft" />
							Para Vendedores Angolanos
							</div>
							<h1 className="vender-stagger text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight leading-[1.1]" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Venda na  <span className="text-orange-400">Kuvangana</span>
							</h1>
							<p className="vender-stagger text-orange-100/80 text-base md:text-lg max-w-xl leading-relaxed mb-8" style={{ animationDelay: '200ms' }}>
							Transforme o seu negócio com uma loja verificada, produtos aprovados e pagamentos controlados.
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
									<span>Cadastro gratuito</span>
								</div>
							</div>
						</div>

						{/* Preview Panel */}
						<div className="vender-stagger flex flex-col gap-3 w-full md:w-auto" style={{ animationDelay: '250ms' }}>
							{['Verificação de identidade pela equipa', 'Crie a loja no painel de vendedor', 'Produtos aprovados antes de ficarem visíveis', 'Pagamento validado via comprovativo'].map((item) => (
								<div key={item} className="backdrop-blur-md bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm text-orange-100/80 flex items-start gap-3 min-w-[240px]">
									<FaCheckCircle className="text-orange-400 mt-0.5 flex-shrink-0" />
									{item}
								</div>
							))}
						</div>
					</div>
				</section>
			</div>

			{/* ═══ Benefits Section ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 py-20">
				<div className="text-center mb-14">
					<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Porquê Nós</span>
					<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
						Por que vender na Kuvangana?
					</h2>
					<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
						Tudo o que precisa para levar o seu negócio para o mercado digital angolano
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

			{/* ═══ How It Works ═══ */}
			<section className="max-w-[1200px] mx-auto px-4 pb-20">
				<div className="text-center mb-14">
					<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>Passo a Passo</span>
					<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
						Comece a vender em 5 passos
					</h2>
					<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
						Do registo da conta até ao primeiro pedido confirmado
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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

			{/* ═══ Requirements + Payment Info ═══ */}
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
								<FaMoneyBillWave className="text-orange-500 text-xl" />
								Como funciona a venda
							</h3>
							<div className="space-y-5">
								{paymentInfo.map((item, i) => (
									<div key={i} className="flex gap-4 p-4 bg-orange-50/50 rounded-xl">
										<div className="flex-shrink-0 w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 shadow-sm">
											<FaCheckCircle className="text-sm" />
										</div>
										<div>
											<h4 className="font-bold text-gray-800 text-sm" style={{ fontFamily: '"Fredoka", sans-serif' }}>{item.title}</h4>
											<p className="text-gray-500 text-xs leading-relaxed mt-1">{item.description}</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══ FAQ ═══ */}
			<section className="bg-[#f5f0eb] pb-20">
				<div className="max-w-[800px] mx-auto px-4">
					<div className="text-center mb-14">
						<span className="vender-stagger inline-block text-orange-500 font-semibold text-sm uppercase tracking-[0.2em] mb-3" style={{ animationDelay: '0ms' }}>FAQ</span>
						<h2 className="vender-stagger text-3xl md:text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: '"Fredoka", sans-serif', animationDelay: '100ms' }}>
							Perguntas frequentes
						</h2>
						<p className="vender-stagger text-gray-500 text-base md:text-lg max-w-2xl mx-auto" style={{ animationDelay: '200ms' }}>
							Tire as suas dúvidas sobre como vender na Kuvangana
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
							Verifique a sua identidade, crie a loja e comece a receber pedidos.
						</p>
						<button
							onClick={handleComecarVender}
							className="bg-white text-orange-600 hover:bg-orange-50 active:bg-gray-100 px-10 py-4 rounded-xl font-bold text-base transition-all duration-300 shadow-lg shadow-black/10 hover:shadow-xl hover:scale-[1.02] inline-flex items-center gap-2 cursor-pointer"
						>
							Começar a vender grátis
							<FaArrowRight />
						</button>
					</div>
				</div>
			</section>
		</div>
	);
};

export default Vender;