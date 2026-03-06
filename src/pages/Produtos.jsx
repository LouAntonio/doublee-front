import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';
import FilterSidebar from '../components/FilterSidebar';
import ProductSkeleton from '../components/ProductSkeleton';
import apiRequest from '../services/api';

const Produtos = () => {
	useDocumentTitle('Produtos - Double E');
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 16;
	const [sortOption, setSortOption] = useState('relevance');

	// Filter state
	const [priceRange, setPriceRange] = useState({ min: '', max: '' });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [rating, setRating] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedBrand, setSelectedBrand] = useState('');
	const [featuredOnly, setFeaturedOnly] = useState(false);

	// Products from backend
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [totalResults, setTotalResults] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const [fetchTrigger, setFetchTrigger] = useState(0);

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	const buildQuery = () => {
		const params = new URLSearchParams();
		params.set('page', currentPage);
		params.set('limit', itemsPerPage);
		if (searchQuery) params.set('search', searchQuery);
		if (selectedCategories && selectedCategories.length) params.set('categoryIds', selectedCategories.join(','));
		if (priceRange.min) params.set('minPrice', priceRange.min);
		if (priceRange.max) params.set('maxPrice', priceRange.max);
		if (featuredOnly) params.set('featured', 'true');
		return `?${params.toString()}`;
	};

	useEffect(() => {
		let mounted = true;
		const fetchProducts = async () => {
			setLoading(true);
			const query = buildQuery();
			const res = await apiRequest(`/products${query}`);
			if (!mounted) return;
			if (res && res.success) {
				const items = (res.data?.products || []).map(p => ({
					id: p.id,
					title: p.name,
					price: p.promotionalPrice ?? p.price,
					oldPrice: p.promotionalPrice ? p.price : undefined,
					image: p.image || '/images/logo/placeholder.png',
					rating: p.rating,
					reviewCount: p.qtdRatings,
				}));
				setProducts(items);
				setTotalResults(res.data?.pagination?.total || 0);
				setTotalPages(res.data?.pagination?.totalPages || 1);
			} else {
				setProducts([]);
				setTotalResults(0);
				setTotalPages(1);
			}
			setLoading(false);
		};

		fetchProducts();
		return () => { mounted = false; };
	}, [currentPage, itemsPerPage, fetchTrigger]);

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
						alt="Produtos promoções"
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
						priceRange={priceRange}
						setPriceRange={setPriceRange}
						selectedCategories={selectedCategories}
						setSelectedCategories={setSelectedCategories}
						rating={rating}
						setRating={setRating}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						selectedBrand={selectedBrand}
						setSelectedBrand={setSelectedBrand}
						featuredOnly={featuredOnly}
						setFeaturedOnly={setFeaturedOnly}
						onSearch={() => { setCurrentPage(1); setFetchTrigger(t => t + 1); }}
						onClear={() => { setCurrentPage(1); setFetchTrigger(t => t + 1); }}
					/>

					{/* Products Grid - Right */}
					<main style={{ flex: 1 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
							<h2 style={{ fontSize: '24px', color: '#333', margin: 0 }}>Produtos</h2>
							<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
								<span style={{ fontSize: '14px', color: '#666' }}>
									Mostrando {((currentPage - 1) * itemsPerPage) + 1}-{((currentPage - 1) * itemsPerPage) + products.length} de {totalResults} resultados
								</span>
								<select
									value={sortOption}
									onChange={(e) => setSortOption(e.target.value)}
									style={{
										padding: '8px',
										borderRadius: '6px',
										border: '1px solid #ddd',
										background: '#fff',
										fontSize: '14px',
										focus: { outline: 'none' },
									}}
								>
									<option value="relevance">Ordenar: Relevância</option>
									<option value="lowest">Menor preço</option>
									<option value="highest">Maior preço</option>
									<option value="name">Nome A-Z</option>
								</select>
							</div>
						</div>

						{loading ? (
							<div style={{
								display: 'grid',
								gridTemplateColumns: 'repeat(4, 1fr)',
								gap: '12px'
							}}>
								{Array.from({ length: itemsPerPage }).map((_, i) => (
									<ProductSkeleton key={i} />
								))}
							</div>
						) : (
							<ProductGrid products={products} />
						)}

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
									backgroundColor: currentPage === 1 ? '#f3f4f6' : '#fff',
									color: currentPage === 1 ? '#d1d5db' : '#666',
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
										backgroundColor: currentPage === i + 1 ? '#F97316' : '#fff',
										color: currentPage === i + 1 ? '#fff' : '#666',
										borderRadius: '4px',
										cursor: 'pointer',
										boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
										fontWeight: '600',
										transition: 'background-color 0.2s, color 0.2s'
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
									backgroundColor: currentPage === totalPages ? '#f3f4f6' : '#fff',
									color: currentPage === totalPages ? '#d1d5db' : '#666',
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

export default Produtos;
