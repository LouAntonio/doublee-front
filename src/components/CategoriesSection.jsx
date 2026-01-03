import React, { useState, useEffect } from 'react';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

const CategoriesSection = () => {
	const [currentPage, setCurrentPage] = useState(0);
	const [itemsPerRow, setItemsPerRow] = useState(4);

	const categories = [
		{
			id: 1,
			name: 'Carros, Motos e Outros',
			icon: '🚗',
			image: 'https://via.placeholder.com/80x80/dc3545/fff?text=🚗',
			link: '/categorias/veiculos'
		},
		{
			id: 2,
			name: 'Celulares e Telefones',
			icon: '📱',
			image: 'https://via.placeholder.com/80x80/e91e63/fff?text=📱',
			link: '/categorias/celulares'
		},
		{
			id: 3,
			name: 'Eletrodomésticos',
			icon: '🔌',
			image: 'https://via.placeholder.com/80x80/9e9e9e/fff?text=🔌',
			link: '/categorias/eletrodomesticos'
		},
		{
			id: 4,
			name: 'Ferramentas',
			icon: '🔧',
			image: 'https://via.placeholder.com/80x80/ff9800/fff?text=🔧',
			link: '/categorias/ferramentas'
		},
		{
			id: 5,
			name: 'Acessórios para Veículos',
			icon: '⚙️',
			image: 'https://via.placeholder.com/80x80/607d8b/fff?text=⚙️',
			link: '/categorias/acessorios-veiculos'
		},
		{
			id: 6,
			name: 'Calçados, Roupas e Bolsas',
			icon: '👗',
			image: 'https://via.placeholder.com/80x80/e91e63/fff?text=👗',
			link: '/categorias/moda'
		},
		{
			id: 7,
			name: 'Esportes e Fitness',
			icon: '🏋️',
			image: 'https://via.placeholder.com/80x80/424242/fff?text=🏋️',
			link: '/categorias/esportes'
		},
		{
			id: 8,
			name: 'Beleza e Cuidado Pessoal',
			icon: '💄',
			image: 'https://via.placeholder.com/80x80/ffc0cb/fff?text=💄',
			link: '/categorias/beleza'
		},
		{
			id: 9,
			name: 'Casa, Móveis e Decoração',
			icon: '🛋️',
			image: 'https://via.placeholder.com/80x80/795548/fff?text=🛋️',
			link: '/categorias/casa'
		},
		{
			id: 10,
			name: 'Informática',
			icon: '💻',
			image: 'https://via.placeholder.com/80x80/4caf50/fff?text=💻',
			link: '/categorias/informatica'
		},
		{
			id: 11,
			name: 'Imóveis',
			icon: '🏠',
			image: 'https://via.placeholder.com/80x80/ff6f00/fff?text=🏠',
			link: '/categorias/imoveis'
		},
		{
			id: 12,
			name: 'Eletrônicos, Áudio e Vídeo',
			icon: '🎧',
			image: 'https://via.placeholder.com/80x80/212121/fff?text=🎧',
			link: '/categorias/eletronicos'
		}
	];

	useEffect(() => {
		const updateItemsPerRow = () => {
			const width = window.innerWidth;
			if (width >= 1200) {
				setItemsPerRow(4);
			} else if (width >= 900) {
				setItemsPerRow(3);
			} else if (width >= 600) {
				setItemsPerRow(2);
			} else {
				setItemsPerRow(1);
			}
		};

		updateItemsPerRow();
		window.addEventListener('resize', updateItemsPerRow);
		return () => window.removeEventListener('resize', updateItemsPerRow);
	}, []);

	const itemsPerPage = itemsPerRow * 3; // 3 rows
	const totalPages = Math.ceil(categories.length / itemsPerPage);

	const getCurrentCategories = () => {
		const start = currentPage * itemsPerPage;
		return categories.slice(start, start + itemsPerPage);
	};

	const nextPage = () => {
		setCurrentPage((prev) => (prev + 1) % totalPages);
	};

	const prevPage = () => {
		setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
	};

	return (
		<section style={{
			backgroundColor: 'transparent',
			display: 'flex',
			justifyContent: 'center',
			padding: '24px 0',
			marginBottom: '16px'
		}}>
			<div style={{
				width: 'calc(100% - 48px)',
				maxWidth: '1180px',
				backgroundColor: '#fff',
				borderRadius: '10px',
				padding: '20px 20px 24px 20px',
				boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
			}}>
				{/* Header */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '20px'
				}}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<h2 style={{
							fontSize: '24px',
							fontWeight: '400',
							color: '#333',
							margin: 0
						}}>
							Categorias
						</h2>
						<a href="/categorias" style={{
							color: '#3483fa',
							fontSize: '14px',
							textDecoration: 'none',
							fontWeight: '400'
						}}>
							Mostrar todas as categorias
						</a>
					</div>

					{/* Pagination Dots */}
					<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
						{Array.from({ length: totalPages }).map((_, idx) => (
							<button
								key={idx}
								onClick={() => setCurrentPage(idx)}
								style={{
									width: '8px',
									height: '8px',
									borderRadius: '50%',
									border: 'none',
									backgroundColor: idx === currentPage ? '#3483fa' : '#d9d9d9',
									cursor: 'pointer',
									padding: 0,
									transition: 'background-color 0.3s'
								}}
								aria-label={`Página ${idx + 1}`}
							/>
						))}
					</div>
				</div>

				{/* Categories Grid with Navigation */}
				<div style={{ position: 'relative' }}>
					{/* Left Arrow */}
					{currentPage > 0 && (
						<button
							onClick={prevPage}
							style={{
								position: 'absolute',
								left: '-20px',
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: '#fff',
								border: '1px solid #ddd',
								borderRadius: '50%',
								width: '40px',
								height: '40px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#f5f5f5';
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#fff';
								e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
							}}
						>
							<IoChevronBack size={24} color="#333" />
						</button>
					)}

					{/* Right Arrow */}
					{currentPage < totalPages - 1 && (
						<button
							onClick={nextPage}
							style={{
								position: 'absolute',
								right: '-20px',
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: '#fff',
								border: '1px solid #ddd',
								borderRadius: '50%',
								width: '40px',
								height: '40px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#f5f5f5';
								e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#fff';
								e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
							}}
						>
							<IoChevronForward size={24} color="#333" />
						</button>
					)}

					{/* Categories Grid */}
					<div style={{
						display: 'grid',
						gridTemplateColumns: `repeat(${itemsPerRow}, 1fr)`,
						gap: '12px',
						overflow: 'hidden'
					}}>
						{getCurrentCategories().map((category) => (
							<a
								key={category.id}
								href={category.link}
								style={{
									display: 'flex',
									alignItems: 'center',
									gap: '16px',
									padding: '16px',
									backgroundColor: '#f5f5f5',
									borderRadius: '8px',
									textDecoration: 'none',
									cursor: 'pointer',
									transition: 'all 0.2s',
									border: '1px solid transparent'
								}}
								onMouseEnter={(e) => {
									e.currentTarget.style.backgroundColor = '#fff';
									e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
									e.currentTarget.style.border = '1px solid #e5e5e5';
									e.currentTarget.style.transform = 'translateY(-2px)';
								}}
								onMouseLeave={(e) => {
									e.currentTarget.style.backgroundColor = '#f5f5f5';
									e.currentTarget.style.boxShadow = 'none';
									e.currentTarget.style.border = '1px solid transparent';
									e.currentTarget.style.transform = 'translateY(0)';
								}}
							>
								{/* Category Icon */}
								<div style={{
									width: '64px',
									height: '64px',
									backgroundColor: '#fff',
									borderRadius: '6px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									flexShrink: 0,
									fontSize: '32px'
								}}>
									{category.icon}
								</div>

								{/* Category Name */}
								<div style={{
									fontSize: '15px',
									fontWeight: '400',
									color: '#333',
									lineHeight: '1.3'
								}}>
									{category.name}
								</div>
							</a>
						))}
					</div>
				</div>
			</div>
		</section>
	);
};

export default CategoriesSection;
