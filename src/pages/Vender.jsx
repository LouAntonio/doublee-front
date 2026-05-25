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
	FaArrowRight,
	FaStar
} from 'react-icons/fa';

const Vender = () => {
	useDocumentTitle('Venda Connosco - Double E');
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
			icon: <FaStore className="text-4xl text-orange-600 mb-4" />,
			title: 'Sua Loja Virtual',
			description: 'Tenha sua própria loja dentro da maior plataforma de e-commerce de Angola.'
		},
		{
			icon: <FaUsers className="text-4xl text-orange-600 mb-4" />,
			title: 'Milhões de Clientes',
			description: 'Acesse uma base de mais de 50.000 clientes ativos procurando produtos como o seu.'
		},
		{
			icon: <FaShieldAlt className="text-4xl text-orange-600 mb-4" />,
			title: 'Segurança Total',
			description: 'Transações seguras e proteção contra fraudes para você vender tranquilamente.'
		},
		{
			icon: <FaChartLine className="text-4xl text-orange-600 mb-4" />,
			title: 'Ferramentas de Gestão',
			description: 'Dashboard completo para gerir produtos, vendas e desempenho da sua loja.'
		},
		{
			icon: <FaMoneyBillWave className="text-4xl text-orange-600 mb-4" />,
			title: 'Pagamento Garantido',
			description: 'Receba suas vendas de forma rápida e segura, sem burocracia.'
		},
		{
			icon: <FaTruck className="text-4xl text-orange-600 mb-4" />,
			title: 'Logística Simplificada',
			description: 'Você cuida da entrega e nós cuidamos de conectar você aos clientes.'
		}
	];

	const steps = [
		{
			number: '01',
			title: 'Crie sua conta',
			description: 'Registe-se na Double E e acesse o painel do vendedor.',
			icon: <FaCheckCircle className="text-2xl" />
		},
		{
			number: '02',
			title: 'Cadastre sua loja',
			description: 'Preencha as informações da sua empresa e aguarde a aprovação.',
			icon: <FaStore className="text-2xl" />
		},
		{
			number: '03',
			title: 'Adicione produtos',
			description: 'Cadastre seus produtos com fotos, descrições e preços.',
			icon: <FaArrowRight className="text-2xl" />
		},
		{
			number: '04',
			title: 'Comece a vender',
			description: 'Receba pedidos, gerencie entregas e receba seus pagamentos.',
			icon: <FaMoneyBillWave className="text-2xl" />
		}
	];

	const requirements = [
		'Cópia do BI ou Passaporte válido',
		'NUIT (Número de Identificação Fiscal)',
		'Comprovativo de morada',
		'Conta bancária para recebimentos',
		'Produtos em conformidade com a lei angolana'
	];

	const testimonials = [
		{
			name: 'Carlos Mendes',
			store: 'TechMundo Angola',
			text: 'A Double E transformou meu negócio. Em 6 meses, tripliquei minhas vendas e alcancei clientes em todo o país.',
			rating: 5
		},
		{
			name: 'Ana Paula Soares',
			store: 'Moda & Estilo',
			text: 'A plataforma é fácil de usar e o suporte é excelente. Recomendo para qualquer empreendedor que queira crescer.',
			rating: 5
		},
		{
			name: 'João Baptista',
			store: 'Casa & Decoração',
			text: 'Comecei pequeno e hoje tenho uma equipe dedicada. A Double E foi fundamental nesse crescimento.',
			rating: 5
		}
	];

	const faqs = [
		{
			question: 'Quanto custa vender na Double E?',
			answer: 'O cadastro é gratuito! Cobramos uma pequena comissão apenas quando você realiza uma venda. Os valores variam por categoria de produto.'
		},
		{
			question: 'Quanto tempo leva a aprovação da loja?',
			answer: 'Após enviar toda a documentação necessária, nossa equipe analisa em até 48 horas úteis.'
		},
		{
			question: 'Como recebo os pagamentos?',
			answer: 'Os pagamentos são depositados na sua conta bancária cadastrada em até 5 dias úteis após a confirmação da entrega.'
		},
		{
			question: 'Posso vender qualquer tipo de produto?',
			answer: 'Produtos devem estar em conformidade com a legislação angolana. Não permitimos venda de produtos ilegais, falsificados ou proibidos.'
		},
		{
			question: 'Preciso ter estoque próprio?',
			answer: 'Sim, você é responsável por manter o estoque e enviar os produtos aos clientes após a venda.'
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />

			{/* Hero Section */}
			<div className="py-12 px-4">
				<div className="max-w-[1200px] mx-auto">
					<div
						className="relative overflow-hidden py-20 px-6 rounded-2xl"
						style={{
							backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80')",
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					>
						<div className="absolute inset-0 bg-gradient-to-r from-orange-900/90 to-orange-800/85"></div>
						<div className="relative z-10 text-center text-white">
							<h1 className="text-4xl md:text-5xl font-bold mb-6">Venda na Double E</h1>
							<p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95 leading-relaxed">
								Junte-se a milhares de vendedores e transforme seu negócio com a maior plataforma de e-commerce de Angola.
							</p>
							<button
								onClick={handleComecarVender}
								className="mt-8 bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2"
							>
								Começar a Vender
								<FaArrowRight />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Benefits Section */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
					Por que vender na Double E?
				</h2>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
					Oferecemos tudo o que você precisa para crescer seu negócio online
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{benefits.map((benefit, index) => (
						<div key={index} className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-shadow duration-300">
							{benefit.icon}
							<h3 className="text-xl font-bold text-gray-800 mb-3">{benefit.title}</h3>
							<p className="text-gray-600 leading-relaxed">{benefit.description}</p>
						</div>
					))}
				</div>
			</div>

			{/* Statistics */}
			<div className="bg-orange-600 py-16">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
						<div>
							<div className="text-4xl font-bold mb-2">50K+</div>
							<div className="text-orange-100">Clientes Ativos</div>
						</div>
						<div>
							<div className="text-4xl font-bold mb-2">5K+</div>
							<div className="text-orange-100">Vendedores</div>
						</div>
						<div>
							<div className="text-4xl font-bold mb-2">100K+</div>
							<div className="text-orange-100">Produtos Vendidos</div>
						</div>
						<div>
							<div className="text-4xl font-bold mb-2">98%</div>
							<div className="text-orange-100">Satisfação</div>
						</div>
					</div>
				</div>
			</div>

			{/* How It Works */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
					Comece a vender em 4 passos
				</h2>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
					Processo simples e rápido para você começar seu negócio
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{steps.map((step, index) => (
						<div key={index} className="relative">
							{index < steps.length - 1 && (
								<div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-orange-200"></div>
							)}
							<div className="relative z-10 bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-lg transition-shadow duration-300">
								<div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
									{step.icon}
								</div>
								<div className="text-orange-600 font-bold text-sm mb-2">PASSO {step.number}</div>
								<h3 className="text-lg font-bold text-gray-800 mb-3">{step.title}</h3>
								<p className="text-gray-600 text-sm">{step.description}</p>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* Requirements */}
			<div className="bg-gray-100 py-16">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-3xl font-bold text-gray-800 mb-6">
								Documentação necessária
							</h2>
							<p className="text-lg text-gray-600 mb-8">
								Para garantir a segurança e confiança de todos, solicitamos os seguintes documentos:
							</p>
							<ul className="space-y-4">
								{requirements.map((req, index) => (
									<li key={index} className="flex items-start gap-3">
										<FaCheckCircle className="text-green-500 mt-1 flex-shrink-0" />
										<span className="text-gray-700">{req}</span>
									</li>
								))}
							</ul>
						</div>
						<div className="bg-white rounded-2xl shadow-sm p-8">
							<h3 className="text-xl font-bold text-gray-800 mb-6">Comissão por venda</h3>
							<div className="space-y-4">
								<div className="flex justify-between items-center py-3 border-b border-gray-100">
									<span className="text-gray-600">Eletrônicos</span>
									<span className="font-semibold text-gray-800">8%</span>
								</div>
								<div className="flex justify-between items-center py-3 border-b border-gray-100">
									<span className="text-gray-600">Moda & Acessórios</span>
									<span className="font-semibold text-gray-800">12%</span>
								</div>
								<div className="flex justify-between items-center py-3 border-b border-gray-100">
									<span className="text-gray-600">Casa & Decoração</span>
									<span className="font-semibold text-gray-800">10%</span>
								</div>
								<div className="flex justify-between items-center py-3 border-b border-gray-100">
									<span className="text-gray-600">Beleza & Saúde</span>
									<span className="font-semibold text-gray-800">10%</span>
								</div>
								<div className="flex justify-between items-center py-3">
									<span className="text-gray-600">Outros</span>
									<span className="font-semibold text-gray-800">15%</span>
								</div>
							</div>
							<p className="text-sm text-gray-500 mt-6">
								* Valores sujeitos a alteração. Consulte termos completos.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Testimonials */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
					Histórias de sucesso
				</h2>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
					Vendedores que cresceram com a Double E
				</p>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<div key={index} className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-lg transition-shadow duration-300">
							<div className="flex text-yellow-400 mb-4">
								{[...Array(testimonial.rating)].map((_, i) => (
									<FaStar key={i} className="text-sm" />
								))}
							</div>
							<p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
							<div className="flex items-center">
								<div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
									{testimonial.name.charAt(0)}
								</div>
								<div>
									<div className="font-semibold text-gray-800">{testimonial.name}</div>
									<div className="text-sm text-gray-500">{testimonial.store}</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			{/* FAQ */}
			<div className="bg-gray-100 py-16">
				<div className="max-w-[800px] mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
						Perguntas frequentes
					</h2>
					<p className="text-lg text-gray-600 text-center mb-12">
						Tire suas dúvidas sobre como vender na Double E
					</p>

					<div className="space-y-4">
						{faqs.map((faq, index) => (
							<details key={index} className="bg-white rounded-xl shadow-sm group">
								<summary className="flex items-center justify-between p-6 cursor-pointer list-none">
									<h3 className="font-semibold text-gray-800 pr-4">{faq.question}</h3>
									<span className="text-orange-600 text-2xl group-open:rotate-45 transition-transform">+</span>
								</summary>
								<div className="px-6 pb-6 text-gray-600 leading-relaxed">
									{faq.answer}
								</div>
							</details>
						))}
					</div>
				</div>
			</div>

			{/* CTA Final */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl p-12 text-center shadow-xl">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Pronto para começar a vender?
					</h2>
					<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
						Junte-se à maior comunidade de compradores e vendedores de Angola.
					</p>
					<button
						onClick={handleComecarVender}
						className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center gap-2"
					>
						Criar minha loja grátis
						<FaArrowRight />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Vender;
