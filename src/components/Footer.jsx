import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
	const footerSections = [
		{
			title: 'Sobre nós',
			links: [
				{ name: 'Institucional', url: '/sobre' },
				{ name: 'Trabalhe conosco', url: '/carreiras' },
				{ name: 'Imprensa', url: '/imprensa' },
				{ name: 'Investidores', url: '/investidores' },
				{ name: 'Sustentabilidade', url: '/sustentabilidade' }
			]
		},
		{
			title: 'Ajuda',
			links: [
				{ name: 'Comprar', url: '/ajuda/comprar' },
				{ name: 'Vender', url: '/ajuda/vender' },
				{ name: 'Entregas e prazos', url: '/ajuda/entregas' },
				{ name: 'Devoluções e reembolsos', url: '/ajuda/devolucoes' },
				{ name: 'Central de atendimento', url: '/contato' }
			]
		},
		{
			title: 'Minha conta',
			links: [
				{ name: 'Resumo', url: '/conta' },
				{ name: 'Minhas compras', url: '/compras' },
				{ name: 'Favoritos', url: '/favoritos' },
				{ name: 'Meus cupons', url: '/cupons' },
				{ name: 'Configurações', url: '/configuracoes' }
			]
		},
				{
					title: 'Pagamento',
					links: [
						{ name: 'Formas de pagamento', url: '/pagamento' },
						{ name: 'Cartão Double E', url: '/cartao' }
					]
				}
	];

	const socialLinks = [
		{ icon: <FaFacebookF />, url: 'https://facebook.com', label: 'Facebook' },
		{ icon: <FaTwitter />, url: 'https://twitter.com', label: 'Twitter' },
		{ icon: <FaInstagram />, url: 'https://instagram.com', label: 'Instagram' },
		{ icon: <FaYoutube />, url: 'https://youtube.com', label: 'YouTube' },
		{ icon: <FaLinkedinIn />, url: 'https://linkedin.com', label: 'LinkedIn' }
	];

	return (
		<footer style={{ backgroundColor: '#fff', marginTop: '40px' }}>
			{/* Main Footer Content */}
			<div style={{
				maxWidth: '1200px',
				margin: '0 auto',
				padding: '40px 24px'
			}}>
				{/* Footer Links Grid */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
					gap: '32px',
					marginBottom: '32px'
				}}>
					{footerSections.map((section, index) => (
						<div key={index}>
							<h3 style={{
								fontSize: '14px',
								fontWeight: '600',
								color: '#333',
								marginBottom: '16px',
								textTransform: 'uppercase'
							}}>
								{section.title}
							</h3>
							<ul style={{
								listStyle: 'none',
								padding: 0,
								margin: 0
							}}>
								{section.links.map((link, linkIndex) => (
									<li key={linkIndex} style={{ marginBottom: '12px' }}>
										<Link
											to={link.url}
											style={{
												fontSize: '13px',
												color: '#666',
												textDecoration: 'none',
												transition: 'color 0.2s'
											}}
											onMouseEnter={(e) => e.currentTarget.style.color = '#3483fa'}
											onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Divider */}
				<div style={{
					height: '1px',
					backgroundColor: '#e5e5e5',
					margin: '32px 0'
				}} />

				{/* Social Media and Additional Info */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '24px'
				}}>
					{/* Social Media Links */}
					<div>
						<h4 style={{
							fontSize: '13px',
							fontWeight: '600',
							color: '#666',
							marginBottom: '12px'
						}}>
							Siga-nos nas redes sociais
						</h4>
						<div style={{
							display: 'flex',
							gap: '12px'
						}}>
							{socialLinks.map((social, index) => (
								<a
									key={index}
									href={social.url}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={social.label}
									style={{
										width: '36px',
										height: '36px',
										borderRadius: '50%',
										backgroundColor: '#f5f5f5',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: '#666',
										fontSize: '16px',
										textDecoration: 'none',
										transition: 'all 0.2s'
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.backgroundColor = '#3483fa';
										e.currentTarget.style.color = '#fff';
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.backgroundColor = '#f5f5f5';
										e.currentTarget.style.color = '#666';
									}}
								>
									{social.icon}
								</a>
							))}
						</div>
					</div>

					{/* Payment Methods */}
					<div>
						<h4 style={{
							fontSize: '13px',
							fontWeight: '600',
							color: '#666',
							marginBottom: '12px'
						}}>
							Formas de pagamento
						</h4>
						<div style={{
							display: 'flex',
							gap: '8px',
							flexWrap: 'wrap'
						}}>
							{['💳', '🏦', '🔐', '📱'].map((icon, index) => (
								<div
									key={index}
									style={{
										width: '48px',
										height: '32px',
										backgroundColor: '#f5f5f5',
										borderRadius: '4px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontSize: '18px'
									}}
								>
									{icon}
								</div>
							))}
						</div>
					</div>
				</div>

				{/* Divider */}
				<div style={{
					height: '1px',
					backgroundColor: '#e5e5e5',
					margin: '32px 0'
				}} />

				{/* Bottom Footer */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					flexWrap: 'wrap',
					gap: '16px',
					fontSize: '12px',
					color: '#999'
				}}>
					<div>
						© 2026 Double E. Todos os direitos reservados.
					</div>
					<div style={{
						display: 'flex',
						gap: '16px',
						flexWrap: 'wrap'
					}}>
						<Link
							to="/termos"
							style={{
								color: '#999',
								textDecoration: 'none'
							}}
							onMouseEnter={(e) => e.currentTarget.style.color = '#3483fa'}
							onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
						>
							Termos e condições
						</Link>
						<Link
							to="/privacidade"
							style={{
								color: '#999',
								textDecoration: 'none'
							}}
							onMouseEnter={(e) => e.currentTarget.style.color = '#3483fa'}
							onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
						>
							Política de privacidade
						</Link>
						<Link
							to="/cookies"
							style={{
								color: '#999',
								textDecoration: 'none'
							}}
							onMouseEnter={(e) => e.currentTarget.style.color = '#3483fa'}
							onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
						>
							Cookies
						</Link>
					</div>
				</div>
			</div>

			{/* Company Info Bar */}
			<div style={{
				backgroundColor: '#f5f5f5',
				padding: '16px 24px',
				textAlign: 'center',
				fontSize: '11px',
				color: '#999'
			}}>
				<div style={{ maxWidth: '1200px', margin: '0 auto' }}>
					Double E Comércio Eletrônico Angola - NUIT: 000000000 | Endereço: Luanda, Angola
				</div>
			</div>
		</footer>
	);
};

export default Footer;
