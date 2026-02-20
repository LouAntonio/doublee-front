import React, { useState } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';

import FilterSidebar from '../components/FilterSidebar';

const Supermarket = () => {
	useDocumentTitle('Supermercado - Double E');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 16;
	const [sortOption, setSortOption] = useState('relevance');

	// Filter state
	const [priceRange, setPriceRange] = useState({ min: '', max: '' });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [rating, setRating] = useState(null);

	// Base products data
	const baseProducts = [
		{
			id: 1,
			title: 'Piscina Inflável Fun Redonda 1400l Com Kit...',
			oldPrice: 279,
			price: 159.90,
			discount: 42,
			image: 'https://via.placeholder.com/200x200/4169E1/fff?text=Piscina'
		},
		{
			id: 2,
			title: 'Mangueira De Jardim 10m Metros Marqs Home...',
			oldPrice: 32.90,
			price: 28.89,
			discount: 12,
			coupon: 'Cupom 6% OFF',
			image: 'https://via.placeholder.com/200x200/00A650/fff?text=Mangueira'
		},
		{
			id: 3,
			title: 'Piscina Banheira Inflável Redonda 450 Litro...',
			oldPrice: 112.62,
			price: 67.80,
			discount: 39,
			image: 'https://via.placeholder.com/200x200/1E90FF/fff?text=Banheira'
		},
		{
			id: 4,
			title: 'Lona Térmica Para Piscinas 3 X 3 Thermocap Cor Verde',
			oldPrice: 181.44,
			price: 154.22,
			discount: 15,
			image: 'https://via.placeholder.com/200x200/008B8B/fff?text=Lona'
		},
		{
			id: 5,
			title: 'Genco 3 Em 1 Múltipla Ação Balde 10kg Cloro Para...',
			price: 199.90,
			image: 'https://via.placeholder.com/200x200/FFD700/333?text=Genco'
		},
		{
			id: 6,
			title: 'Piscina Infantil Quadrada Estrutural Pvc 1500 Litros...',
			price: 232.99,
			image: 'https://via.placeholder.com/200x200/87CEEB/333?text=Piscina+Infantil'
		},
		{
			id: 7,
			title: 'Kit Limpeza Piscina Completo 7 Peças Aspirador...',
			oldPrice: 289.90,
			price: 189.90,
			discount: 34,
			image: 'https://via.placeholder.com/200x200/4682B4/fff?text=Kit+Limpeza'
		},
		{
			id: 8,
			title: 'Bomba Filtrante Para Piscina 3785 L/h 110v...',
			oldPrice: 349,
			price: 259.90,
			discount: 25,
			image: 'https://via.placeholder.com/200x200/5F9EA0/fff?text=Bomba'
		}
	];

	// Generate 48 products (3 pages) for demonstration
	const totalProducts = Array(48).fill(null).map((_, index) => ({
		...baseProducts[index % baseProducts.length],
		id: index + 1
	}));

	// Apply sorting before pagination
	const getSortedProducts = () => {
		let sorted = [...totalProducts];

		// Logic to toggle sort options could be added here
		if (sortOption === 'lowest') {
			sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
		} else if (sortOption === 'highest') {
			sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
		} else if (sortOption === 'name') {
			sorted.sort((a, b) => String(a.title).localeCompare(String(b.title)));
		}
		return sorted;
	};

	const sortedProducts = getSortedProducts();
	// Pagination logic
	const indexOfLastItem = currentPage * itemsPerPage;
	const indexOfFirstItem = indexOfLastItem - itemsPerPage;
	const currentProducts = sortedProducts.slice(indexOfFirstItem, indexOfLastItem);
	const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<div style={{ backgroundColor: '#ededed', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
			<Header />

			<div style={{
				maxWidth: '1200px',
				margin: '0 auto',
				width: '100%',
				padding: '24px 20px',
				flex: 1
			}}>
				{/* Contained Hero Image */}
				<div style={{
					marginBottom: '24px',
					borderRadius: '8px',
					overflow: 'hidden',
					boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
				}}>
					<img
						src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80&auto=format&fit=crop"
						alt="Supermercado promoções"
						style={{
							width: '100%',
							height: '250px',
							objectFit: 'cover',
							display: 'block'
						}}
					/>
				</div>

				<div style={{
					display: 'flex',
					gap: '24px',
					position: 'relative'
				}}>
					<FilterSidebar
						categories={['Mercearia', 'Bebidas', 'Higiene', 'Limpeza', 'Hortifruti', 'Carnes', 'Padaria', 'Laticínios', 'Congelados']}
						priceRange={priceRange}
						setPriceRange={setPriceRange}
						selectedCategories={selectedCategories}
						setSelectedCategories={setSelectedCategories}
						rating={rating}
						setRating={setRating}
					/>

					{/* Products Grid - Right */}
					<main style={{ flex: 1 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
							<h2 style={{ fontSize: '24px', color: '#333', margin: 0 }}>Supermercado</h2>
							<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<span style={{ fontSize: '14px', color: '#666' }}>
									Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalProducts.length)} de {totalProducts.length} resultados
								</span>
								<select
									value={sortOption}
									onChange={(e) => setSortOption(e.target.value)}
									style={{
										padding: '8px',
										borderRadius: '6px',
										border: '1px solid #ddd',
										background: '#fff',
										fontSize: '14px'
									}}
								>
									<option value="relevance">Ordenar: Relevância</option>
									<option value="lowest">Menor preço</option>
									<option value="highest">Maior preço</option>
									<option value="name">Nome A-Z</option>
								</select>
							</div>
						</div>

						<ProductGrid products={currentProducts} />

						{/* Pagination Controls */}
						<div style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: '32px',
							gap: '8px'
						}}>
							<button
								onClick={() => paginate(Math.max(1, currentPage - 1))}
								disabled={currentPage === 1}
								style={{
									width: '40px',
									height: '40px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									border: 'none',
									backgroundColor: currentPage === 1 ? '#ccc' : '#fff',
									color: currentPage === 1 ? '#fff' : '#333',
									borderRadius: '4px',
									cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
									boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
								}}
							>
								<IoChevronBack size={20} />
							</button>

							{Array.from({ length: totalPages }).map((_, i) => (
								<button
									key={i}
									onClick={() => paginate(i + 1)}
									style={{
										width: '40px',
										height: '40px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										border: 'none',
										backgroundColor: currentPage === i + 1 ? '#3483fa' : '#fff',
										color: currentPage === i + 1 ? '#fff' : '#333',
										borderRadius: '4px',
										cursor: 'pointer',
										boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
										fontWeight: '600'
									}}
								>
									{i + 1}
								</button>
							))}

							<button
								onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
								disabled={currentPage === totalPages}
								style={{
									width: '40px',
									height: '40px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									border: 'none',
									backgroundColor: currentPage === totalPages ? '#ccc' : '#fff',
									color: currentPage === totalPages ? '#fff' : '#333',
									borderRadius: '4px',
									cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
									boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
								}}
							>
								<IoChevronForward size={20} />
							</button>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
};

export default Supermarket;
