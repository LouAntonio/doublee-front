import React, { useState } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import { notyf } from '../utils/notyf';
import axios from 'axios';
import {
	FaWhatsapp,
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaEnvelope,
	FaRegPaperPlane,
	FaSpinner,
	FaCheckCircle,
	FaExclamationCircle,
	FaClock,
} from 'react-icons/fa';

const INITIAL_FORM = { name: '', email: '', subject: '', message: '' };
const INITIAL_ERRORS = { name: '', email: '', subject: '', message: '' };
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const Contato = () => {
	useDocumentTitle('Contato - Kusumba');

	const [form, setForm] = useState(INITIAL_FORM);
	const [errors, setErrors] = useState(INITIAL_ERRORS);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitStatus, setSubmitStatus] = useState('idle');

	const validate = () => {
		const newErrors = { ...INITIAL_ERRORS };
		let valid = true;

		if (!form.name.trim() || form.name.trim().length < 2) {
			newErrors.name = 'O nome deve ter pelo menos 2 caracteres';
			valid = false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
			newErrors.email = 'Insira um e-mail válido';
			valid = false;
		}

		if (!form.subject.trim() || form.subject.trim().length < 3) {
			newErrors.subject = 'O assunto deve ter pelo menos 3 caracteres';
			valid = false;
		}

		if (!form.message.trim() || form.message.trim().length < 10) {
			newErrors.message = 'A mensagem deve ter pelo menos 10 caracteres';
			valid = false;
		}

		setErrors(newErrors);
		return valid;
	};

	const handleChange = (e) => {
		const { id, value } = e.target;
		setForm((prev) => ({ ...prev, [id]: value }));
		if (errors[id]) {
			setErrors((prev) => ({ ...prev, [id]: '' }));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validate()) return;

		setIsSubmitting(true);
		setSubmitStatus('idle');

		try {
			const response = await axios.post(`${API_BASE}/contact`, form);
			notyf.success(response?.data?.msg || 'Mensagem enviada com sucesso!');
			setForm(INITIAL_FORM);
			setSubmitStatus('success');
			setTimeout(() => setSubmitStatus('idle'), 5000);
		} catch (err) {
			const msg = err?.response?.data?.msg || 'Erro ao enviar mensagem. Tente novamente.';
			notyf.error(msg);
			setSubmitStatus('error');
			setTimeout(() => setSubmitStatus('idle'), 5000);
		} finally {
			setIsSubmitting(false);
		}
	};

	const contactInfo = [
		{
			icon: <FaMapMarkerAlt />,
			title: 'Endereço',
			content: 'Centralidade do Kilamba, Ed. B15, Apt. 33, Luanda - Angola',
		},
		{
			icon: <FaPhoneAlt />,
			title: 'Telefone',
			content: '+244 923 000 000',
			action: { label: 'Ligar agora', href: 'tel:+244923000000' },
		},
		{
			icon: <FaEnvelope />,
			title: 'E-mail',
			content: 'contato@Kusumba.ao',
			action: { label: 'Enviar e-mail', href: 'mailto:contato@Kusumba.ao' },
		},
	];

	return (
		<div className="min-h-screen bg-sand flex flex-col geo-pattern">
			<Header />

			<section className="relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-[#1C1917] via-[#2D2416] to-[#3D2E1F]" />
				<div
					className="absolute inset-0 opacity-10"
					style={{
						backgroundImage:
							'radial-gradient(circle at 25% 25%, rgba(249,115,22,0.3) 0%, transparent 50%),radial-gradient(circle at 75% 75%, rgba(251,191,36,0.15) 0%, transparent 50%)',
					}}
				/>
				<div className="relative max-w-[1200px] mx-auto px-4 py-20 md:py-28">
					<div className="max-w-3xl">
						<h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 animate-fade-in-up">
							Vamos
							<br />
							<span className="text-[#F97316]">conversar</span>
						</h1>
						<p
							className="text-lg md:text-xl text-white/80 max-w-xl leading-relaxed animate-fade-in-up"
							style={{ animationDelay: '0.15s' }}
						>
							Estamos aqui para ajudar. Dúvidas, sugestões ou parcerias - a Kusumba está pronta para ouvir.
						</p>
					</div>
				</div>
				<div
					className="absolute -bottom-px left-0 right-0 h-16 bg-sand"
					style={{ clipPath: 'ellipse(70% 100% at 50% 100%)' }}
				/>
			</section>

			<div className="max-w-[1200px] mx-auto px-4 pb-20 -mt-8 relative z-10">
				<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

					<div className="lg:col-span-3 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
						<div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-xl border border-white/50">
							<h2 className="font-display text-2xl md:text-3xl text-[#1a1a2e] mb-2">
								Envie uma mensagem
							</h2>
							<p className="text-[#6b7280] mb-8">
								Preencha o formulário abaixo e responderemos em até dois dias úteis.
							</p>

							<form onSubmit={handleSubmit} className="space-y-6" noValidate>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label htmlFor="name" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
											Nome Completo
										</label>
										<input
											type="text"
											id="name"
											value={form.name}
											onChange={handleChange}
											className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white/80 backdrop-blur-sm outline-none transition-all duration-200 placeholder:text-gray-400 ${
												errors.name
													? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
													: 'border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10'
											}`}
											placeholder="Seu nome"
											aria-invalid={!!errors.name}
											aria-describedby={errors.name ? 'name-error' : undefined}
										/>
										{errors.name && (
											<p id="name-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
												<FaExclamationCircle className="text-xs flex-shrink-0" />
												{errors.name}
											</p>
										)}
									</div>
									<div>
										<label htmlFor="email" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
											E-mail
										</label>
										<input
											type="email"
											id="email"
											value={form.email}
											onChange={handleChange}
											className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white/80 backdrop-blur-sm outline-none transition-all duration-200 placeholder:text-gray-400 ${
												errors.email
													? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
													: 'border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10'
											}`}
											placeholder="seu@email.com"
											aria-invalid={!!errors.email}
											aria-describedby={errors.email ? 'email-error' : undefined}
										/>
										{errors.email && (
											<p id="email-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
												<FaExclamationCircle className="text-xs flex-shrink-0" />
												{errors.email}
											</p>
										)}
									</div>
								</div>

								<div>
									<label htmlFor="subject" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
										Assunto
									</label>
									<input
										type="text"
										id="subject"
										value={form.subject}
										onChange={handleChange}
										className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white/80 backdrop-blur-sm outline-none transition-all duration-200 placeholder:text-gray-400 ${
											errors.subject
												? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
												: 'border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10'
										}`}
										placeholder="Como podemos ajudar?"
										aria-invalid={!!errors.subject}
										aria-describedby={errors.subject ? 'subject-error' : undefined}
									/>
									{errors.subject && (
										<p id="subject-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
											<FaExclamationCircle className="text-xs flex-shrink-0" />
											{errors.subject}
										</p>
									)}
								</div>

								<div>
									<label htmlFor="message" className="block text-sm font-semibold text-[#1a1a2e] mb-2">
										Mensagem
									</label>
									<textarea
										id="message"
										rows="5"
										value={form.message}
										onChange={handleChange}
										className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white/80 backdrop-blur-sm outline-none transition-all duration-200 placeholder:text-gray-400 resize-none ${
											errors.message
												? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
												: 'border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-[#F97316]/10'
										}`}
										placeholder="Escreva sua mensagem aqui..."
										aria-invalid={!!errors.message}
										aria-describedby={errors.message ? 'message-error' : undefined}
									/>
									{errors.message && (
										<p id="message-error" className="mt-1.5 text-sm text-red-500 flex items-center gap-1">
											<FaExclamationCircle className="text-xs flex-shrink-0" />
											{errors.message}
										</p>
									)}
								</div>

								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full bg-[#F97316] hover:bg-[#EA580C] text-white font-bold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 text-lg disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#F97316]/25 active:scale-[0.98]"
								>
									{isSubmitting ? (
										<>
											<FaSpinner className="animate-spin" />
											A enviar...
										</>
									) : (
										<>
											<FaRegPaperPlane />
											Enviar Mensagem
										</>
									)}
								</button>

								{submitStatus === 'success' && (
									<div className="flex items-center gap-3 p-4 rounded-xl bg-[#F97316]/10 text-[#EA580C] font-medium animate-fade-in-up">
										<FaCheckCircle className="text-lg flex-shrink-0" />
										Mensagem enviada com sucesso! Responderemos em breve.
									</div>
								)}
								{submitStatus === 'error' && (
									<div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 font-medium animate-fade-in-up">
										<FaExclamationCircle className="text-lg flex-shrink-0" />
										Erro ao enviar. Tente novamente ou contacte-nos por WhatsApp.
									</div>
								)}
							</form>
						</div>
					</div>

					<div className="lg:col-span-2 flex flex-col gap-6">

						<a
							href="https://wa.me/244923000000?text=Ol%C3%A1%21%20Gostaria%20de%20falar%20com%20a%20Double%20E."
							target="_blank"
							rel="noreferrer"
							className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white animate-fade-in-up"
							style={{ animationDelay: '0.4s' }}
						>
							<div
								className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
								style={{
									background:
										'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.15) 0%, transparent 60%)',
								}}
							/>
							<div className="relative flex items-center gap-4">
								<div className="relative">
									<FaWhatsapp className="text-4xl" />
									<span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping-soft opacity-75" />
									<span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full" />
								</div>
								<div className="flex-1 min-w-0">
									<h3 className="font-display text-xl font-semibold">Fale connosco no WhatsApp</h3>
									<p className="text-white/80 text-sm mt-1">Atendimento rápido e personalizado</p>
								</div>
								<div className="hidden sm:flex items-center gap-1 text-xs bg-white/20 rounded-full px-3 py-1 flex-shrink-0">
									<FaClock className="text-[10px]" />
									Online
								</div>
							</div>
						</a>

						<div
							className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl border border-white/50 animate-fade-in-up"
							style={{ animationDelay: '0.5s' }}
						>
							<h3 className="font-display text-xl text-[#1a1a2e] mb-6">Informações de Contato</h3>
							<div className="space-y-6">
								{contactInfo.map((item, idx) => (
									<div key={idx} className="flex items-start gap-4 group">
										<div className="w-11 h-11 rounded-xl bg-[#F97316]/10 flex items-center justify-center text-[#F97316] text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110">
											{item.icon}
										</div>
										<div>
											<h4 className="font-semibold text-[#1a1a2e] text-sm">{item.title}</h4>
											<p className="text-gray-600 text-sm whitespace-pre-line mt-0.5">{item.content}</p>
											{item.action && (
												<a
													href={item.action.href}
													className="inline-block mt-1.5 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors"
												>
													{item.action.label} &rarr;
												</a>
											)}
										</div>
									</div>
								))}
							</div>
						</div>

						<div
							className="rounded-2xl overflow-hidden shadow-xl border border-white/50 h-64 animate-fade-in-up"
							style={{ animationDelay: '0.6s' }}
						>
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.7668683273373!2d13.251721858978255!3d-8.99358721811268!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1a521f8630aef2ab%3A0x9b91c6910f8f043e!2sEdif%C3%ADcio%20B15!5e0!3m2!1spt-PT!2sao!4v1779718753715!5m2!1spt-PT!2sao"
								width="100%"
								height="100%"
								style={{ border: 0 }}
								allowFullScreen
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								title="Localização da Kusumba"
							/>
						</div>

					</div>
				</div>
			</div>
		</div>
	);
};

export default Contato;
