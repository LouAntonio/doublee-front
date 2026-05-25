import React, { useState, useEffect } from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import FilterSidebar from '../components/FilterSidebar';
import ProductSkeleton from '../components/ProductSkeleton';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useQuery } from '@tanstack/react-query';
import { getOnSaleProducts } from '../services/products';

const calculateTimeLeft = () => {
	const now = new Date();
	const midnight = new Date();
	midnight.setHours(24, 0, 0, 0);
	const diff = midnight - now;
	if (diff > 0) {
		return {
			hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
			minutes: Math.floor((diff / 1000 / 60) % 60),
			seconds: Math.floor((diff / 1000) % 60),
		};
	}
	return { hours: 0, minutes: 0, seconds: 0 };
};

const pad = (n) => n.toString().padStart(2, '0');

const normalizeProduct = (p) => ({
	id: p.id,
	title: p.name,
	price: p.promotionalPrice ?? p.price,
	oldPrice: p.promotionalPrice ? p.price : undefined,
	promotionalEndDate: p.promotionalEndDate,
	image: p.image || '/images/logo/placeholder.png',
	rating: p.rating,
	reviewCount: p.qtdRatings,
	discount: p.promotionalPrice && p.price ? Math.round(((p.price - p.promotionalPrice) / p.price) * 100) : 0,
});

const sortProducts = (items, option) => {
	if (option === 'lowest') return [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
	if (option === 'highest') return [...items].sort((a, b) => (b.price || 0) - (a.price || 0));
	if (option === 'name') return [...items].sort((a, b) => String(a.title).localeCompare(String(b.title)));
	return items;
};

const Promocoes = () => {
	useDocumentTitle('Produtos em Promoção - Double E');

	const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

	useEffect(() => {
		const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
		return () => clearInterval(timer);
	}, []);

	const [priceRange, setPriceRange] = useState({ min: '', max: '' });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [rating, setRating] = useState(null);
	const [sortOption, setSortOption] = useState('relevance');
	const [featuredOnly, setFeaturedOnly] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [fetchTrigger, setFetchTrigger] = useState(0);
	const itemsPerPage = 12;

	const queryParams = {
		page: currentPage,
		limit: itemsPerPage,
		onPromotion: 'true',
	};
	if (selectedCategories?.length) queryParams.categoryIds = selectedCategories.join(',');
	if (priceRange.min) queryParams.minPrice = priceRange.min;
	if (priceRange.max) queryParams.maxPrice = priceRange.max;
	if (featuredOnly) queryParams.featured = 'true';

	const { data, isLoading } = useQuery({
		queryKey: ['products', 'on-sale', queryParams, fetchTrigger],
		queryFn: async () => {
			const res = await getOnSaleProducts(queryParams);
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar promoções');
			const items = (res.data?.products || []).map(normalizeProduct);
			const sorted = sortProducts(items, sortOption);
			return {
				offers: sorted,
				total: res.data?.pagination?.total || 0,
				totalPages: res.data?.pagination?.totalPages || 1,
			};
		},
		staleTime: 1000 * 60 * 2,
	});

	const offers = data?.offers || [];
	const totalResults = data?.total || 0;
	const totalPages = data?.totalPages || 1;

	const paginate = (pageNumber) => setCurrentPage(pageNumber);

	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-50 flex flex-col">
				<div className="max-w-[1200px] mx-auto px-4 w-full flex-1 py-8">
					<div
						className="relative bg-cover bg-center text-white py-12 mb-8 shadow-lg rounded-xl overflow-hidden"
						style={{ backgroundImage: "url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070&auto=format&fit=crop')" }}
					>
						<div className="absolute inset-0 bg-black/50 z-0"></div>
						<div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-8">
							<div className="mb-6 md:mb-0">
								<h1 className="text-4xl font-extrabold mb-2 tracking-tight">Produtos em Promoção</h1>
								<p className="text-gray-100 text-lg max-w-xl">
                  Aproveite descontos exclusivos por tempo limitado. Corra antes que o estoque acabe!
								</p>
							</div>
							<div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl text-center min-w-[300px]">
								<p className="text-blue-50 text-sm font-semibold uppercase tracking-wider mb-3">Termina em:</p>
								<div className="flex justify-center gap-4 text-3xl font-bold font-mono">
									<div className="bg-white text-blue-800 rounded-lg p-2 w-16 shadow-lg">
										{pad(timeLeft.hours)}
										<span className="block text-xs font-sans font-normal text-blue-600 mt-1">HORAS</span>
									</div>
									<span className="self-center -mt-6">:</span>
									<div className="bg-white text-blue-800 rounded-lg p-2 w-16 shadow-lg">
										{pad(timeLeft.minutes)}
										<span className="block text-xs font-sans font-normal text-blue-600 mt-1">MIN</span>
									</div>
									<span className="self-center -mt-6">:</span>
									<div className="bg-white text-blue-800 rounded-lg p-2 w-16 shadow-lg">
										{pad(timeLeft.seconds)}
										<span className="block text-xs font-sans font-normal text-blue-600 mt-1">SEG</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="flex gap-6">
						<FilterSidebar
							priceRange={priceRange}
							setPriceRange={setPriceRange}
							selectedCategories={selectedCategories}
							setSelectedCategories={setSelectedCategories}
							rating={rating}
							setRating={setRating}
							featuredOnly={featuredOnly}
							setFeaturedOnly={setFeaturedOnly}
							onSearch={() => { setCurrentPage(1); setFetchTrigger(t => t + 1); }}
							onClear={() => { setCurrentPage(1); setFetchTrigger(t => t + 1); }}
						/>

						<div className="flex-1">
							<div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
								<div className="flex items-center gap-2">
									<span className="w-2 h-8 bg-blue-600 rounded-full inline-block"></span>
									<div>
										<h2 className="text-xl font-bold text-gray-800">Destaques do Dia</h2>
										<span className="text-xs text-gray-500 font-medium">{totalResults} produtos encontrados</span>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-sm text-gray-600">Ordenar por:</span>
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 bg-white"
									>
										<option value="relevance">Relevância</option>
										<option value="lowest">Menor Preço</option>
										<option value="highest">Maior Preço</option>
										<option value="name">Nome (A-Z)</option>
									</select>
								</div>
							</div>

							{isLoading ? (
								<div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
									{Array.from({ length: itemsPerPage }).map((_, i) => (
										<ProductSkeleton key={i} />
									))}
								</div>
							) : (
								<ProductGrid products={offers} />
							)}

							{totalPages > 1 && (
								<div className="flex justify-center items-center mt-8 gap-2">
									<button
										onClick={() => paginate(Math.max(1, currentPage - 1))}
										disabled={currentPage === 1}
										className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition-colors cursor-pointer ${currentPage === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500 border-gray-200'}`}
									>
										<IoChevronBack size={18} />
									</button>
									{Array.from({ length: totalPages }).map((_, i) => (
										<button
											key={i}
											onClick={() => paginate(i + 1)}
											className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition-all font-medium cursor-pointer ${currentPage === i + 1 ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500 border-gray-200'}`}
										>
											{i + 1}
										</button>
									))}
									<button
										onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
										disabled={currentPage === totalPages}
										className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition-colors cursor-pointer ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-gray-600 hover:bg-gray-50 hover:text-orange-500 border-gray-200'}`}
									>
										<IoChevronForward size={18} />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Promocoes;
