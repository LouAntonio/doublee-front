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
	FaLaptop,
	FaUsers,
	FaArrowRight
} from 'react-icons/fa';

const ComoFunciona = () => {
	useDocumentTitle('Como Funciona - Double E');

	const buyerSteps = [
		{
			icon: <FaSearch className="text-3xl" />,
			title: 'Busque produtos',
			description: 'Explore milhares de produtos das melhores lojas de Angola.'
		},
		{
			icon: <FaShoppingCart className="text-3xl" />,
			title: 'Adicione ao carrinho',
			description: 'Selecione os produtos desejados e revise seu pedido.'
		},
		{
			icon: <FaCreditCard className="text-3xl" />,
			title: 'Pagamento seguro',
			description: 'Pague com segurança usando múltiplas formas de pagamento.'
		},
		{
			icon: <FaTruck className="text-3xl" />,
			title: 'Receba em casa',
			description: 'Acompanhe sua entrega e receba no conforto da sua casa.'
		}
	];

	const sellerSteps = [
		{
			icon: <FaStore className="text-3xl" />,
			title: 'Crie sua loja',
			description: 'Registe-se e configure sua loja virtual gratuitamente.'
		},
		{
			icon: <FaUpload className="text-3xl" />,
			title: 'Cadastre produtos',
			description: 'Adicione fotos, descrições e preços dos seus produtos.'
		},
		{
			icon: <FaBoxOpen className="text-3xl" />,
			title: 'Receba pedidos',
			description: 'Gerencie pedidos e prepare para envio.'
		},
		{
			icon: <FaMoneyBillWave className="text-3xl" />,
			title: 'Receba pagamentos',
			description: 'Receba o valor das vendas na sua conta bancária.'
		}
	];

	const features = [
		{
			icon: <FaShieldAlt className="text-4xl text-orange-600 mb-4" />,
			title: 'Compra protegida',
			description: 'Seu dinheiro só é liberado ao vendedor após confirmar o recebimento.'
		},
		{
			icon: <FaHeadset className="text-4xl text-orange-600 mb-4" />,
			title: 'Suporte dedicado',
			description: 'Equipe disponível para ajudar em caso de dúvidas ou problemas.'
		},
		{
			icon: <FaMobileAlt className="text-4xl text-orange-600 mb-4" />,
			title: 'App mobile',
			description: 'Compre e venda de qualquer lugar através do nosso aplicativo.'
		},
		{
			icon: <FaStar className="text-4xl text-orange-600 mb-4" />,
			title: 'Avaliações reais',
			description: 'Sistema de avaliações para garantir transparência nas negociações.'
		}
	];

	const paymentMethods = [
		{ name: 'Cartão de Crédito', icon: '💳', description: 'Visa, Mastercard, etc.' },
		{ name: 'Transferência Bancária', icon: '🏦', description: 'BAI, BFA, Standard Bank' },
		{ name: 'Multicaixa', icon: '💳', description: 'Pagamento por referência' },
		{ name: 'Carteira Digital', icon: '📱', description: 'Saldo Double E' }
	];

	const categories = [
		{ name: 'Tecnologia', icon: '💻', count: '5.000+ produtos' },
		{ name: 'Moda', icon: '👕', count: '3.500+ produtos' },
		{ name: 'Casa & Móveis', icon: '🏠', count: '2.800+ produtos' },
		{ name: 'Beleza & Saúde', icon: '💄', count: '2.200+ produtos' },
		{ name: 'Esportes', icon: '⚽', count: '1.500+ produtos' },
		{ name: 'Livros', icon: '📚', count: '1.000+ produtos' }
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
							backgroundImage: "url('https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1600&q=80')",
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					>
						<div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/85"></div>
						<div className="relative z-10 text-center text-white">
							<h1 className="text-4xl md:text-5xl font-bold mb-6">Como Funciona a Double E</h1>
							<p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-95 leading-relaxed">
								Descubra como comprar e vender de forma simples, segura e rápida na maior plataforma de e-commerce de Angola.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tabs Section - Para Compradores e Vendedores */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
					{/* Para Compradores */}
					<div className="bg-white rounded-2xl shadow-sm p-8">
						<div className="flex items-center gap-4 mb-8">
							<div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
								<FaShoppingCart className="text-2xl text-blue-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-800">Para Compradores</h2>
						</div>

						<div className="space-y-6">
							{buyerSteps.map((step, index) => (
								<div key={index} className="flex gap-4">
									<div className="flex-shrink-0 w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
										{step.icon}
									</div>
									<div>
										<h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
										<p className="text-gray-600 text-sm">{step.description}</p>
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 pt-8 border-t border-gray-100">
							<h3 className="font-bold text-gray-800 mb-4">Categorias disponíveis</h3>
							<div className="grid grid-cols-2 gap-3">
								{categories.map((cat, index) => (
									<div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
										<span className="text-xl">{cat.icon}</span>
										<div>
											<div className="text-sm font-medium text-gray-800">{cat.name}</div>
											<div className="text-xs text-gray-500">{cat.count}</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Para Vendedores */}
					<div className="bg-white rounded-2xl shadow-sm p-8">
						<div className="flex items-center gap-4 mb-8">
							<div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center">
								<FaStore className="text-2xl text-orange-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-800">Para Vendedores</h2>
						</div>

						<div className="space-y-6">
							{sellerSteps.map((step, index) => (
								<div key={index} className="flex gap-4">
									<div className="flex-shrink-0 w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
										{step.icon}
									</div>
									<div>
										<h3 className="font-bold text-gray-800 mb-1">{step.title}</h3>
										<p className="text-gray-600 text-sm">{step.description}</p>
									</div>
								</div>
							))}
						</div>

						<div className="mt-8 pt-8 border-t border-gray-100">
							<h3 className="font-bold text-gray-800 mb-4">Vantagens de vender</h3>
							<ul className="space-y-3">
								{[
									'Acesso a mais de 50.000 clientes',
									'Painel de gestão completo',
									'Pagamentos garantidos',
									'Sem custo fixo mensal',
									'Suporte especializado'
								].map((item, index) => (
									<li key={index} className="flex items-center gap-2">
										<FaCheckCircle className="text-green-500 flex-shrink-0" />
										<span className="text-gray-700 text-sm">{item}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>

			{/* Recursos e Segurança */}
			<div className="bg-gray-100 py-16">
				<div className="max-w-[1200px] mx-auto px-4">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
						Por que usar a Double E?
					</h2>
					<p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
						Recursos que tornam sua experiência única e segura
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{features.map((feature, index) => (
							<div key={index} className="bg-white rounded-2xl shadow-sm p-8 text-center hover:shadow-lg transition-shadow duration-300">
								{feature.icon}
								<h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Formas de Pagamento */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
					Formas de pagamento
				</h2>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
					Pague da forma que preferir, com total segurança
				</p>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{paymentMethods.map((method, index) => (
						<div key={index} className="bg-white rounded-2xl shadow-sm p-6 text-center hover:shadow-md transition-shadow duration-300">
							<div className="text-4xl mb-4">{method.icon}</div>
							<h3 className="font-bold text-gray-800 mb-2">{method.name}</h3>
							<p className="text-sm text-gray-500">{method.description}</p>
						</div>
					))}
				</div>
			</div>

			{/* Processo de Compra Protegida */}
			<div className="bg-blue-600 py-16">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-bold text-white mb-4">
							Compra Protegida Double E
						</h2>
						<p className="text-blue-100 text-lg max-w-2xl mx-auto">
							Seu dinheiro fica seguro até você receber o produto
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
							<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
								<span className="text-xl font-bold">1</span>
							</div>
							<h3 className="font-bold text-lg mb-2">Você paga</h3>
							<p className="text-blue-100 text-sm">
								O valor fica guardado em nossa plataforma
							</p>
						</div>
						<div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
							<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
								<span className="text-xl font-bold">2</span>
							</div>
							<h3 className="font-bold text-lg mb-2">Vendedor envia</h3>
							<p className="text-blue-100 text-sm">
								O vendedor é notificado e envia o produto
							</p>
						</div>
						<div className="bg-white/10 backdrop-blur rounded-xl p-6 text-white">
							<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
								<span className="text-xl font-bold">3</span>
							</div>
							<h3 className="font-bold text-lg mb-2">Você confirma</h3>
							<p className="text-blue-100 text-sm">
								Após receber, confirma e o vendedor recebe
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Dicas de Segurança */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
					Dicas de segurança
				</h2>
				<p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
					Compre e venda com tranquilidade seguindo estas recomendações
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					<div className="bg-white rounded-2xl shadow-sm p-8">
						<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
							<div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
								<FaCheckCircle className="text-green-600" />
							</div>
							Para compradores
						</h3>
						<ul className="space-y-4">
							{[
								'Verifique a avaliação do vendedor antes de comprar',
								'Leia as descrições dos produtos atentamente',
								'Use sempre o sistema de mensagens da plataforma',
								'Confirme o recebimento do produto antes de liberar o pagamento',
								'Em caso de problemas, contacte nosso suporte imediatamente'
							].map((item, index) => (
								<li key={index} className="flex items-start gap-3">
									<FaArrowRight className="text-green-500 mt-1 flex-shrink-0 text-sm" />
									<span className="text-gray-700">{item}</span>
								</li>
							))}
						</ul>
					</div>

					<div className="bg-white rounded-2xl shadow-sm p-8">
						<h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
							<div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
								<FaStore className="text-orange-600" />
							</div>
							Para vendedores
						</h3>
						<ul className="space-y-4">
							{[
								'Seja honesto nas descrições dos produtos',
								'Use fotos reais e de qualidade',
								'Envie os produtos dentro do prazo combinado',
								'Mantenha comunicação clara com os compradores',
								'Embale bem os produtos para evitar danos'
							].map((item, index) => (
								<li key={index} className="flex items-start gap-3">
									<FaArrowRight className="text-orange-500 mt-1 flex-shrink-0 text-sm" />
									<span className="text-gray-700">{item}</span>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			{/* Estatísticas */}
			<div className="bg-gray-100 py-16">
				<div className="max-w-[1200px] mx-auto px-4">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
						<div>
							<div className="text-4xl font-bold text-orange-600 mb-2">50K+</div>
							<div className="text-gray-600">Usuários cadastrados</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-orange-600 mb-2">100K+</div>
							<div className="text-gray-600">Produtos disponíveis</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-orange-600 mb-2">5K+</div>
							<div className="text-gray-600">Vendedores ativos</div>
						</div>
						<div>
							<div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
							<div className="text-gray-600">Avaliação positiva</div>
						</div>
					</div>
				</div>
			</div>

			{/* CTA Final */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">
				<div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl p-12 text-center shadow-xl">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">
						Comece agora mesmo
					</h2>
					<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
						Junte-se à Double E e faça parte da maior comunidade de compras e vendas de Angola.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<a
							href="/auth"
							className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg inline-flex items-center justify-center gap-2"
						>
							<FaShoppingCart />
							Começar a Comprar
						</a>
						<a
							href="/vender"
							className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2"
						>
							<FaStore />
							Começar a Vender
						</a>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ComoFunciona;
