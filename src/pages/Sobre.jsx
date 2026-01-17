import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import { FaBullseye, FaEye, FaHeart, FaTruck, FaHeadset, FaShieldAlt, FaUsers, FaAward, FaShoppingCart, FaStar, FaQuoteLeft } from 'react-icons/fa';

const Sobre = () => {
	useDocumentTitle('Sobre - Double E');

	const features = [
		{
			icon: <FaTruck className="text-4xl text-blue-600 mb-4" />,
			title: 'Entrega Rápida',
			description: 'Garantimos que seus produtos cheguem até você com a maior agilidade possível.'
		},
		{
			icon: <FaShieldAlt className="text-4xl text-blue-600 mb-4" />,
			title: 'Compra Segura',
			description: 'Seus dados protegidos com as mais avançadas tecnologias de segurança.'
		},
		{
			icon: <FaHeadset className="text-4xl text-blue-600 mb-4" />,
			title: 'Suporte 24/7',
			description: 'Nossa equipe está sempre pronta para ajudar você em qualquer momento.'
		}
	];

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />

			{/* Hero Section (constrained width) */}
			<div className="py-12 px-4">
				<div className="max-w-[1200px] mx-auto">
					<div
						className="relative overflow-hidden py-20 px-6 rounded-2xl"
						style={{
							backgroundImage: "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80')",
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					>
						<div className="absolute inset-0 bg-blue-900/55"></div>
						<div className="relative z-10 text-center text-white">
							<h1 className="text-4xl md:text-5xl font-bold mb-6">Sobre a Double E</h1>
							<p className="text-xl md:text-2xl max-w-2xl mx-auto opacity-95 leading-relaxed">
								Sua plataforma de confiança para descobrir e comprar os melhores produtos do mercado.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Statistics Section */}
			<div className="max-w-[1200px] mx-auto px-4 py-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
						<FaUsers className="text-4xl text-blue-600 mx-auto mb-3" />
						<div className="text-3xl font-bold text-gray-800 mb-1">50K+</div>
						<div className="text-sm text-gray-600">Clientes Satisfeitos</div>
					</div>
					<div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
						<FaShoppingCart className="text-4xl text-green-600 mx-auto mb-3" />
						<div className="text-3xl font-bold text-gray-800 mb-1">100K+</div>
						<div className="text-sm text-gray-600">Produtos Vendidos</div>
					</div>
					<div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
						<FaAward className="text-4xl text-yellow-600 mx-auto mb-3" />
						<div className="text-3xl font-bold text-gray-800 mb-1">15+</div>
						<div className="text-sm text-gray-600">Prémios Recebidos</div>
					</div>
					<div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow">
						<FaStar className="text-4xl text-purple-600 mx-auto mb-3" />
						<div className="text-3xl font-bold text-gray-800 mb-1">4.8/5</div>
						<div className="text-sm text-gray-600">Avaliação Média</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-[1200px] mx-auto px-4 py-16">

				{/* Story Section */}
				<div className="max-w-4xl mx-auto text-center mb-20">
					<h2 className="text-3xl font-bold text-gray-800 mb-6">Nossa História</h2>
					<p className="text-lg text-gray-600 leading-relaxed mb-8">
						Fundada com a visão de simplificar o comércio eletrônico, a Double E começou como uma pequena startup com grandes sonhos.
						Hoje, somos referência em qualidade e atendimento, conectando milhares de clientes a produtos que fazem a diferença em suas vidas.
						Acreditamos que comprar online deve ser uma experiência prazerosa, segura e transparente.
					</p>
				</div>

				{/* Mission, Vision, Values Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
					<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border-t-4 border-blue-500">
						<div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
							<FaBullseye className="text-3xl text-blue-600" />
						</div>
						<h3 className="text-xl font-bold text-gray-800 mb-3">Missão</h3>
						<p className="text-gray-600">
							Oferecer produtos de excelência com um serviço impecável, superando as expectativas de nossos clientes a cada entrega.
						</p>
					</div>

					<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border-t-4 border-indigo-500">
						<div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
							<FaEye className="text-3xl text-indigo-600" />
						</div>
						<h3 className="text-xl font-bold text-gray-800 mb-3">Visão</h3>
						<p className="text-gray-600">
							Ser a plataforma de e-commerce mais admirada e confiável do país, reconhecida pela inovação e responsabilidade.
						</p>
					</div>

					<div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 text-center border-t-4 border-purple-500">
						<div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
							<FaHeart className="text-3xl text-purple-600" />
						</div>
						<h3 className="text-xl font-bold text-gray-800 mb-3">Valores</h3>
						<p className="text-gray-600">
							Ética, transparência, paixão pelo cliente, inovação constante e compromisso com a sustentabilidade.
						</p>
					</div>
				</div>

				{/* Features Section */}
				<div className="bg-white rounded-3xl shadow-sm p-12 mb-20">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Por que escolher a Double E?</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
						{features.map((feature, index) => (
							<div key={index} className="flex flex-col items-center text-center group">
								<div className="transform transition-transform duration-300 group-hover:scale-110">
									{feature.icon}
								</div>
								<h4 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h4>
								<p className="text-gray-600">{feature.description}</p>
							</div>
						))}
					</div>
				</div>

				{/* Timeline Section */}
				<div className="mb-20">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Nossa Jornada</h2>
					<div className="relative">
						<div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
						<div className="space-y-12">
							{[
								{ year: '2020', title: 'Fundação', desc: 'Double E é fundada com a missão de revolucionar o e-commerce em Angola.' },
								{ year: '2021', title: 'Expansão', desc: 'Alcançamos 10.000 clientes e expandimos nosso catálogo para mais de 5.000 produtos.' },
								{ year: '2023', title: 'Reconhecimento', desc: 'Premiados como a melhor plataforma de e-commerce em Angola.' },
								{ year: '2026', title: 'Liderança', desc: 'Mais de 50.000 clientes confiam na Double E para suas compras online.' }
							].map((item, idx) => (
								<div key={idx} className={`flex items-center ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
									<div className="w-1/2 ${idx % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}"></div>
									<div className="relative z-10 flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full border-4 border-white shadow-lg">
										<span className="text-white font-bold text-sm">{item.year.slice(-2)}</span>
									</div>
									<div className={`w-1/2 ${idx % 2 === 0 ? 'pl-8' : 'pr-8'}`}>
										<div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
											<div className="text-blue-600 font-bold text-lg mb-2">{item.year}</div>
											<h4 className="text-xl font-semibold text-gray-800 mb-2">{item.title}</h4>
											<p className="text-gray-600">{item.desc}</p>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Testimonials Section */}
				<div className="mb-20">
					<h2 className="text-3xl font-bold text-center text-gray-800 mb-12">O que nossos clientes dizem</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{ name: 'Maria Silva', role: 'Cliente há 2 anos', text: 'A Double E transformou minha experiência de compras online. Produtos de qualidade e entrega rápida!' },
							{ name: 'João Santos', role: 'Empresário', text: 'Excelente atendimento e preços competitivos. Recomendo para todos que buscam confiabilidade.' },
							{ name: 'Ana Costa', role: 'Designer', text: 'Adoro a variedade de produtos e a facilidade de navegação. Sempre encontro o que preciso!' }
						].map((testimonial, idx) => (
							<div key={idx} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow relative">
								<FaQuoteLeft className="text-3xl text-blue-200 mb-4" />
								<p className="text-gray-600 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
								<div className="flex items-center">
									<div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
										{testimonial.name.charAt(0)}
									</div>
									<div>
										<div className="font-semibold text-gray-800">{testimonial.name}</div>
										<div className="text-sm text-gray-500">{testimonial.role}</div>
									</div>
								</div>
								<div className="flex text-yellow-400 mt-4">
									{[...Array(5)].map((_, i) => <FaStar key={i} className="text-sm" />)}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* CTA Section */}
				<div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl p-12 text-center shadow-xl">
					<h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para começar?</h2>
					<p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
						Junte-se a milhares de clientes satisfeitos e descubra as melhores ofertas do mercado.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg">
							Ver Produtos
						</button>
						<button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">
							Entrar em Contacto
						</button>
					</div>
				</div>

			</div>
		</div>
	);
};

export default Sobre;
