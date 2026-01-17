import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaRegPaperPlane } from 'react-icons/fa';

const Contato = () => {
	useDocumentTitle('Contato - Double E');

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<Header />

			{/* Hero Section */}
			<div className="py-12 px-4">
				<div className="max-w-[1200px] mx-auto">
					<div
						className="relative overflow-hidden py-16 px-6 rounded-2xl"
						style={{
							backgroundImage: "url('https://images.unsplash.com/photo-1526244434298-88fcbcb066b5?auto=format&fit=crop&w=1600&q=80')",
							backgroundSize: 'cover',
							backgroundPosition: 'center'
						}}
					>
						<div className="absolute inset-0 bg-black/45"></div>
						<div className="relative z-10 text-center text-white">
							<h1 className="text-3xl md:text-5xl font-bold mb-4">Fale Conosco</h1>
							<p className="text-lg md:text-xl max-w-2xl mx-auto opacity-95">
								Estamos aqui para ajudar. Entre em contato para dúvidas, sugestões ou parcerias.
							</p>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="max-w-[1200px] mx-auto px-4 pb-16">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

					{/* Contact Form */}
					<div className="bg-white rounded-2xl shadow-sm p-8">
						<h2 className="text-2xl font-bold text-gray-800 mb-6">Envie uma mensagem</h2>
						<form className="space-y-6">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
									<input
										type="text"
										id="name"
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
										placeholder="Seu nome"
									/>
								</div>
								<div>
									<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
									<input
										type="email"
										id="email"
										className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
										placeholder="seu@email.com"
									/>
								</div>
							</div>

							<div>
								<label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">Assunto</label>
								<input
									type="text"
									id="subject"
									className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
									placeholder="Como podemos ajudar?"
								/>
							</div>

							<div>
								<label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">Mensagem</label>
								<textarea
									id="message"
									rows="5"
									className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
									placeholder="Escreva sua mensagem aqui..."
								></textarea>
							</div>

							<button
								type="button"
								className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
							>
								<FaRegPaperPlane />
								Enviar Mensagem
							</button>
						</form>
					</div>

					{/* Contact Info */}
					<div className="flex flex-col gap-8">
						{/* Info Cards */}
						<div className="bg-white rounded-2xl shadow-sm p-8">
							<h2 className="text-2xl font-bold text-gray-800 mb-8">Informações de Contato</h2>

							<div className="space-y-8">
								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
										<FaMapMarkerAlt className="text-xl text-blue-600" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">Endereço</h3>
										<p className="text-gray-600">Av. Principal, 1000 - Centro<br />São Paulo - SP, 01000-000</p>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
										<FaPhoneAlt className="text-xl text-blue-600" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">Telefone</h3>
										<p className="text-gray-600 mb-2">+55 (11) 99999-9999</p>
										<a href="tel:+5511999999999" className="text-sm text-blue-600 font-medium hover:underline">
											Ligar agora
										</a>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
										<FaEnvelope className="text-xl text-blue-600" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">E-mail</h3>
										<p className="text-gray-600 mb-2">contato@doublee.com</p>
										<a href="mailto:contato@doublee.com" className="text-sm text-blue-600 font-medium hover:underline">
											Enviar e-mail
										</a>
									</div>
								</div>

								<div className="flex items-start gap-4">
									<div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
										<FaWhatsapp className="text-xl text-green-600" />
									</div>
									<div>
										<h3 className="font-semibold text-gray-900 mb-1">WhatsApp</h3>
										<p className="text-gray-600 mb-2">Atendimento rápido via chat</p>
										<a href="#" className="text-sm text-green-600 font-medium hover:underline">
											Iniciar conversa
										</a>
									</div>
								</div>
							</div>
						</div>

						{/* Map Placeholder */}
						<div className="bg-gray-200 rounded-2xl h-64 w-full flex items-center justify-center text-gray-400">
							<div className="text-center">
								<FaMapMarkerAlt className="text-4xl mx-auto mb-2 opacity-50" />
								<span className="text-sm font-medium">Mapa de Localização</span>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	);
};

export default Contato;
