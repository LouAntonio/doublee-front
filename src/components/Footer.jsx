import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaTiktok } from 'react-icons/fa';

const footerLinks = {
	empresa: {
		title: 'Empresa',
		links: [
			{ label: 'Sobre Nós', to: '/sobre' },
			{ label: 'Como Funciona', to: '/como-funciona' },
			{ label: 'Vender na Kuvangana', to: '/vender' },
			{ label: 'Contacto', to: '/contato' },
		],
	},
	comprar: {
		title: 'Comprar',
		links: [
			{ label: 'Produtos', to: '/produtos' },
			{ label: 'Promoções', to: '/promocoes' },
			{ label: 'Cupões', to: '/cupoes' },
			{ label: 'Categorias', to: '/categorias' },
			{ label: 'Lojas', to: '/lojas' },
		],
	},
	conta: {
		title: 'Minha Conta',
		links: [
			{ label: 'Dashboard', to: '/dashboard' },
			{ label: 'Favoritos', to: '/wishlist' },
			{ label: 'Carrinho', to: '/cart' },
			{ label: 'Criar Conta', to: '/auth' },
		],
	},
};

const socialLinks = [
	{ icon: FaFacebookF, href: '#', label: 'Facebook' },
	{ icon: FaInstagram, href: '#', label: 'Instagram' },
	{ icon: FaYoutube, href: '#', label: 'YouTube' },
	{ icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
	{ icon: FaTiktok, href: '#', label: 'TikTok' },
];

const Footer = () => {
	return (
		<footer className="bg-[#1C1917]">
			<div className="max-w-[1200px] mx-auto px-4 pt-12 pb-8">

				{/* ── Link columns ── */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-10">

					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link to="/" className="inline-block mb-4">
							<img
								src="/images/logo/logoBranco.png"
								alt="Kuvangana"
								className="h-8 w-auto"
							/>
						</Link>
						<p className="text-sm text-stone-400 font-body leading-relaxed max-w-[240px]">
							Marketplace angolano de confiança. Compre, venda e descubra produtos de qualidade.
						</p>
					</div>

					{/* Link columns */}
					{Object.values(footerLinks).map((section) => (
						<div key={section.title}>
							<h3 className="text-sm font-display font-semibold text-[#F5F0EB] uppercase tracking-wider mb-4">
								{section.title}
							</h3>
							<ul className="space-y-2.5">
								{section.links.map((link) => (
									<li key={link.to}>
										<Link
											to={link.to}
											className="text-sm text-stone-400 font-body hover:text-[#F97316] transition-colors duration-200"
										>
											{link.label}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* ── Divider ── */}
				<hr className="border-white/10 mb-8" />

				{/* ── Payment methods ── */}
				<div className="mb-8">
					<h4 className="text-xs font-display font-semibold text-stone-400 uppercase tracking-wider mb-3">
						Métodos de Pagamento
					</h4>
					<div className="flex flex-wrap gap-2">
						<span className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-stone-300 font-body">
							Multicaixa Express
						</span>
						<span className="inline-flex items-center px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-stone-300 font-body">
							Transferência Bancária
						</span>
					</div>
				</div>

				{/* ── Divider ── */}
				<hr className="border-white/10 mb-8" />

				{/* ── Social + bottom bar ── */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">

					{/* Social */}
					<div>
						<h4 className="text-xs font-display font-semibold text-stone-400 uppercase tracking-wider mb-3">
							Siga-nos
						</h4>
						<div className="flex items-center gap-2">
							{socialLinks.map((s) => {
								const Icon = s.icon;
								return (
									<a
										key={s.label}
										href={s.href}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={s.label}
										className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-stone-400 hover:bg-[#F97316] hover:border-[#F97316] hover:text-white transition-all duration-200"
									>
										<Icon className="w-4 h-4" />
									</a>
								);
							})}
						</div>
					</div>

					{/* Copyright + credit */}
					<div className="text-xs text-stone-400 font-body space-y-1 sm:text-right">
						<p>© 2026 Kuvangana. Todos os direitos reservados.</p>
						<p>
							Desenvolvido por{' '}
							<a
								href="https://louantonio-me.vercel.app/"
								target="_blank"
								rel="noopener noreferrer"
								className="text-[#F97316] hover:text-[#EA580C] transition-colors duration-200"
							>
								Lourenço António
							</a>
						</p>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
