import React, { useState } from 'react';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import { IoChevronBack, IoChevronForward, IoFilter, IoClose, IoSearchOutline } from 'react-icons/io5';
import useDocumentTitle from '../hooks/useDocumentTitle';
import FilterSidebar from '../components/FilterSidebar';
import ProductSkeleton from '../components/ProductSkeleton';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/products';

const normalizeProduct = (p) => ({
	id: p.id,
	title: p.name,
	price: p.promotionalPrice ?? p.price,
	oldPrice: p.promotionalPrice ? p.price : undefined,
	promotionalEndDate: p.promotionalEndDate,
	image: p.image || '/images/logo/placeholder.png',
	rating: p.rating,
	reviewCount: p.qtdRatings,
});

const sortProducts = (items, option) => {
	if (option === 'lowest') return [...items].sort((a, b) => (a.price || 0) - (b.price || 0));
	if (option === 'highest') return [...items].sort((a, b) => (b.price || 0) - (a.price || 0));
	if (option === 'name') return [...items].sort((a, b) => String(a.title).localeCompare(String(b.title)));
	return items;
};

const Produtos = () => {
	useDocumentTitle('Produtos - Double E');

	const [drawerOpen, setDrawerOpen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 12;
	const [sortOption, setSortOption] = useState('relevance');

	const [priceRange, setPriceRange] = useState({ min: '', max: '' });
	const [selectedCategories, setSelectedCategories] = useState([]);
	const [rating, setRating] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedBrand, setSelectedBrand] = useState('');
	const [featuredOnly, setFeaturedOnly] = useState(false);
	const [fetchTrigger, setFetchTrigger] = useState(0);

	const queryParams = {
		page: currentPage,
		limit: itemsPerPage,
	};
	if (searchQuery) queryParams.search = searchQuery;
	if (selectedCategories?.length) queryParams.categoryIds = selectedCategories.join(',');
	if (priceRange.min) queryParams.minPrice = priceRange.min;
	if (priceRange.max) queryParams.maxPrice = priceRange.max;
	if (featuredOnly) queryParams.featured = 'true';

	const { data, isLoading } = useQuery({
		queryKey: ['products', 'list', queryParams, fetchTrigger],
		queryFn: async () => {
			const res = await getProducts(queryParams);
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar produtos');
			const items = (res.data?.products || []).map(normalizeProduct);
			const sorted = sortProducts(items, sortOption);
			return {
				products: sorted,
				total: res.data?.pagination?.total || 0,
				totalPages: res.data?.pagination?.totalPages || 1,
			};
		},
		staleTime: 1000 * 60 * 2,
	});

	const products = data?.products || [];
	const totalResults = data?.total || 0;
	const totalPages = data?.totalPages || 1;

	const triggerSearch = () => { setCurrentPage(1); setFetchTrigger(t => t + 1); };

	const startResult = totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endResult = Math.min(currentPage * itemsPerPage, totalResults);

	return (
		<>
			<Header />
			<div className="min-h-screen bg-[#faf8f6] flex flex-col">
				<div className="max-w-[1200px] mx-auto px-4 w-full flex-1">

					{/* ── Hero Banner ── */}
					<div className="relative mt-4 bg-gradient-to-b from-[#1a0a00] via-[#2d1300] to-[#3d1a00] text-white rounded-2xl overflow-hidden shadow-2xl">
						{/* SVG Waves */}
						<div className="absolute inset-0 overflow-hidden pointer-events-none">
							<svg className="promocoes-wave absolute -top-10 -left-10 w-[120%] h-auto opacity-[0.08]" viewBox="0 0 1440 320" preserveAspectRatio="none">
								<path fill="#F97316" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
							</svg>
							<svg className="promocoes-wave-delayed absolute -bottom-10 -right-10 w-[120%] h-auto opacity-[0.05]" viewBox="0 0 1440 320" preserveAspectRatio="none">
								<path fill="#F97316" d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,186.7C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"/>
							</svg>
							<svg className="promocoes-wave absolute top-1/2 -translate-y-1/2 w-full h-auto opacity-[0.04]" viewBox="0 0 1440 400" preserveAspectRatio="none">
								<path fill="#F97316" d="M0,200 C360,100 1080,300 1440,200 L1440,400 L0,400Z"/>
							</svg>
						</div>

						{/* Radial glow */}
						<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />

						<div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-10 md:py-14">
							<div className="mb-6 md:mb-0 text-center md:text-left">
								<div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 rounded-full px-4 py-1.5 text-orange-200 text-xs font-semibold uppercase tracking-wider mb-4 promocoes-stagger" style={{ animationDelay: '0ms' }}>
									<span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping-soft" />
									Catálogo Completo
								</div>
								<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight" style={{ fontFamily: '"Fredoka", sans-serif' }}>
									Produtos<br />
									<span className="text-orange-400">Disponíveis</span>
								</h1>
								<p className="text-orange-100/80 text-base md:text-lg max-w-xl leading-relaxed">
									Explore todos os produtos disponíveis na Double E. Encontre o que precisa para o seu dia a dia.
								</p>
							</div>

							<div className="bg-orange-500/10 backdrop-blur-md border border-orange-400/20 rounded-xl text-center min-w-[280px] md:min-w-[300px] p-6 promocoes-stagger" style={{ animationDelay: '150ms' }}>
								<svg className="mx-auto mb-3" width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="4" y="10" width="32" height="24" rx="4" stroke="#F97316" strokeWidth="2" fill="none" />
									<path d="M4 16H36" stroke="#F97316" strokeWidth="2" />
									<circle cx="14" cy="28" r="3" stroke="#F97316" strokeWidth="2" fill="none" />
									<circle cx="26" cy="28" r="3" stroke="#F97316" strokeWidth="2" fill="none" />
									<path d="M14 25V23" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
									<path d="M26 25V23" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
								</svg>
								<p className="text-orange-200 text-xs font-semibold uppercase tracking-[0.15em] mb-1">Milhares de Produtos</p>
								<p className="text-orange-300/70 text-xs">Disponíveis para si</p>
							</div>
						</div>
					</div>

					{/* ── Content ── */}
					<div className="flex gap-6 py-8 relative">
						{/* Desktop sidebar */}
						<div className="hidden lg:block">
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
								onSearch={triggerSearch}
								onClear={triggerSearch}
							/>
						</div>

						{/* Mobile drawer overlay */}
						{drawerOpen && (
							<div className="promocoes-drawer-overlay open lg:hidden" onClick={() => setDrawerOpen(false)} />
						)}

						{/* Mobile drawer */}
						<div className={`promocoes-drawer lg:hidden ${drawerOpen ? 'open' : ''}`}>
							<div className="flex items-center justify-between p-4 border-b border-gray-100">
								<h3 className="text-lg font-bold text-gray-800" style={{ fontFamily: '"Fredoka", sans-serif' }}>Filtros</h3>
								<button
									onClick={() => setDrawerOpen(false)}
									className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-500 transition-colors cursor-pointer"
								>
									<IoClose size={20} />
								</button>
							</div>
							<div className="p-4">
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
									onSearch={() => { setDrawerOpen(false); triggerSearch(); }}
									onClear={() => { setDrawerOpen(false); triggerSearch(); }}
								/>
							</div>
						</div>

						{/* Product area */}
						<div className="flex-1 min-w-0">
							{/* Sort header */}
							<div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
								<div className="flex items-center gap-3">
									<button
										onClick={() => setDrawerOpen(true)}
										className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors cursor-pointer"
									>
										<IoFilter size={18} />
									</button>
									<div className="flex items-center gap-2">
										<span className="w-1.5 h-8 bg-orange-500 rounded-full inline-block" />
										<div>
											<h2 className="text-xl font-bold text-gray-800" style={{ fontFamily: '"Fredoka", sans-serif' }}>Produtos</h2>
											<span className="text-xs text-gray-500 font-medium">
												{totalResults > 0
													? `Mostrando ${startResult}-${endResult} de ${totalResults} resultados`
													: 'Nenhum resultado'}
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<span className="text-sm text-gray-500 hidden sm:inline">Ordenar por:</span>
									<select
										value={sortOption}
										onChange={(e) => setSortOption(e.target.value)}
										className="p-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 bg-white text-gray-700"
									>
										<option value="relevance">Relevância</option>
										<option value="lowest">Menor Preço</option>
										<option value="highest">Maior Preço</option>
										<option value="name">Nome (A-Z)</option>
									</select>
								</div>
							</div>

							{/* Loading state */}
							{isLoading ? (
								<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
									{Array.from({ length: itemsPerPage }).map((_, i) => (
										<div key={i} className="promocoes-skeleton rounded-xl p-0" style={{ animationDelay: `${(i % 8) * 50}ms` }}>
											<ProductSkeleton />
										</div>
									))}
								</div>
							) : products.length > 0 ? (
								<>
									<ProductGrid products={products} />

									{/* Pagination */}
									{totalPages > 1 && (
										<div className="flex justify-center items-center mt-10 gap-2">
											<button
												onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
												disabled={currentPage === 1}
												className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 shadow-sm transition-all cursor-pointer ${
													currentPage === 1
														? 'bg-gray-50 text-gray-300 cursor-not-allowed'
														: 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
												}`}
											>
												<IoChevronBack size={18} />
											</button>
											{Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
												const pageNum = totalPages <= 7 ? i + 1 : (() => {
													if (currentPage <= 3) return i + 1;
													if (currentPage >= totalPages - 2) return totalPages - 6 + i;
													return currentPage - 3 + i;
												})();
												const isActive = currentPage === pageNum;
												return (
													<button
														key={pageNum}
														onClick={() => setCurrentPage(pageNum)}
														className={`w-10 h-10 flex items-center justify-center rounded-lg border shadow-sm transition-all font-semibold cursor-pointer text-sm ${
															isActive
																? 'bg-orange-500 text-white border-orange-500 shadow-orange-500/20 scale-105'
																: 'bg-white text-gray-600 border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
														}`}
													>
														{pageNum}
													</button>
												);
											})}
											<button
												onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
												disabled={currentPage === totalPages}
												className={`w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 shadow-sm transition-all cursor-pointer ${
													currentPage === totalPages
														? 'bg-gray-50 text-gray-300 cursor-not-allowed'
														: 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
												}`}
											>
												<IoChevronForward size={18} />
											</button>
										</div>
									)}
								</>
							) : (
								/* Empty state */
								<div className="flex flex-col items-center justify-center py-20 px-4 text-center">
									<div className="promocoes-empty-icon mb-6">
										<svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
											<rect x="15" y="20" width="90" height="12" rx="4" stroke="#F97316" strokeWidth="2" fill="#FFF7ED" />
											<rect x="15" y="38" width="90" height="12" rx="4" stroke="#F97316" strokeWidth="2" fill="#FFF7ED" />
											<rect x="15" y="56" width="90" height="12" rx="4" stroke="#F97316" strokeWidth="2" fill="#FFF7ED" />
											<rect x="35" y="38" width="30" height="12" rx="2" stroke="#F97316" strokeWidth="1.5" fill="#FFEDD5" opacity="0.6" />
											<rect x="50" y="56" width="20" height="12" rx="2" stroke="#F97316" strokeWidth="1.5" fill="#FFEDD5" opacity="0.6" />
											<rect x="25" y="20" width="40" height="12" rx="2" stroke="#F97316" strokeWidth="1.5" fill="#FFEDD5" opacity="0.6" />
											<circle cx="60" cy="95" r="12" stroke="#F97316" strokeWidth="2.5" fill="none" />
											<path d="M54 95H66M60 89V101" stroke="#F97316" strokeWidth="2" strokeLinecap="round" />
											<path d="M20 75L60 79L100 75" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 3" opacity="0.4" />
										</svg>
									</div>
									<h3 className="text-xl font-bold text-gray-700 mb-2" style={{ fontFamily: '"Fredoka", sans-serif' }}>
										Nenhum produto encontrado
									</h3>
									<p className="text-gray-500 text-sm max-w-md mb-6">
										Nenhum produto corresponde aos filtros selecionados. Tente ajustar os critérios de busca.
									</p>
									<button
										onClick={() => {
											setPriceRange({ min: '', max: '' });
											setSelectedCategories([]);
											setRating(null);
											setSearchQuery('');
											setSelectedBrand('');
											setFeaturedOnly(false);
											setCurrentPage(1);
											setFetchTrigger(t => t + 1);
										}}
										className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-semibold text-sm py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
									>
										<IoSearchOutline size={16} />
										Limpar Filtros
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

export default Produtos;