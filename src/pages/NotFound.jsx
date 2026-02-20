import React from 'react';
import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';

const NotFound = () => {
	useDocumentTitle('404 - Página não encontrada');

	return (
		<>
			<Header />
			<div style={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				backgroundColor: '#f5f5f5',
				padding: '20px'
			}}>
				<div style={{
					textAlign: 'center',
					maxWidth: '600px',
					backgroundColor: '#fff',
					padding: '60px 40px',
					borderRadius: '12px',
					boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
				}}>
					{/* 404 Number */}
					<div style={{
						fontSize: '120px',
						fontWeight: '700',
						color: '#3483fa',
						lineHeight: '1',
						marginBottom: '20px',
						textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
					}}>
						404
					</div>

					{/* Sad Face Icon */}
					<div style={{
						fontSize: '80px',
						marginBottom: '24px',
						filter: 'grayscale(20%)'
					}}>
						😕
					</div>

					{/* Main Message */}
					<h1 style={{
						fontSize: '32px',
						fontWeight: '600',
						color: '#333',
						marginBottom: '16px'
					}}>
						Página não encontrada
					</h1>

					{/* Description */}
					<p style={{
						fontSize: '16px',
						color: '#666',
						lineHeight: '1.6',
						marginBottom: '32px'
					}}>
						Ops! A página que você está procurando não existe ou foi movida.
						Verifique o endereço digitado ou volte para a página inicial.
					</p>

					{/* Action Buttons */}
					<div style={{
						display: 'flex',
						gap: '12px',
						justifyContent: 'center',
						flexWrap: 'wrap'
					}}>
						<Link
							to="/"
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								padding: '14px 32px',
								backgroundColor: '#3483fa',
								color: '#fff',
								textDecoration: 'none',
								borderRadius: '6px',
								fontSize: '16px',
								fontWeight: '600',
								transition: 'all 0.2s',
								boxShadow: '0 2px 8px rgba(52,131,250,0.3)'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#2968c8';
								e.currentTarget.style.transform = 'translateY(-2px)';
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(52,131,250,0.4)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#3483fa';
								e.currentTarget.style.transform = 'translateY(0)';
								e.currentTarget.style.boxShadow = '0 2px 8px rgba(52,131,250,0.3)';
							}}
						>
							🏠 Ir para a página inicial
						</Link>

						<button
							onClick={() => window.history.back()}
							style={{
								display: 'inline-flex',
								alignItems: 'center',
								gap: '8px',
								padding: '14px 32px',
								backgroundColor: '#fff',
								color: '#3483fa',
								border: '2px solid #3483fa',
								borderRadius: '6px',
								fontSize: '16px',
								fontWeight: '600',
								cursor: 'pointer',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#f0f7ff';
								e.currentTarget.style.transform = 'translateY(-2px)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#fff';
								e.currentTarget.style.transform = 'translateY(0)';
							}}
						>
							← Voltar
						</button>
					</div>

					{/* Helpful Links */}
					<div style={{
						marginTop: '40px',
						paddingTop: '32px',
						borderTop: '1px solid #e5e5e5'
					}}>
						<p style={{
							fontSize: '14px',
							color: '#999',
							marginBottom: '12px'
						}}>
							Ou explore essas páginas:
						</p>
						<div style={{
							display: 'flex',
							gap: '16px',
							justifyContent: 'center',
							flexWrap: 'wrap'
						}}>
							<Link
								to="/promocoes"
								style={{
									fontSize: '14px',
									color: '#3483fa',
									textDecoration: 'none',
									transition: 'color 0.2s'
								}}
								onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
								onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
							>
								Promoções
							</Link>
							<Link
								to="/categorias"
								style={{
									fontSize: '14px',
									color: '#3483fa',
									textDecoration: 'none',
									transition: 'color 0.2s'
								}}
								onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
								onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
							>
								Categorias
							</Link>
							<Link
								to="/cupoes"
								style={{
									fontSize: '14px',
									color: '#3483fa',
									textDecoration: 'none',
									transition: 'color 0.2s'
								}}
								onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
								onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
							>
								Cupons
							</Link>
							<Link
								to="/contato"
								style={{
									fontSize: '14px',
									color: '#3483fa',
									textDecoration: 'none',
									transition: 'color 0.2s'
								}}
								onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
								onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
							>
								Contato
							</Link>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default NotFound;
