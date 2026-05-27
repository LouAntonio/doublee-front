import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCategories } from '../hooks/queries/useCategories';
import { getProducts } from '../services/products';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import ProductGrid from '../components/ProductGrid';
import ProductSkeleton from '../components/ProductSkeleton';
import { IoChevronBack, IoChevronForward, IoArrowBack } from 'react-icons/io5';
import './categorias/categorias.css';

const slugify = (s) =>
	String(s).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const normalizeProduct = (p) => ({
	id: p.id,
	title: p.name,
	price: p.promotionalPrice ?? p.price,
	oldPrice: p.promotionalPrice ? p.price : undefined,
	promotionalPrice: p.promotionalPrice,
	promotionalEndDate: p.promotionalEndDate,
	image: p.image || '/images/produto.png',
	rating: p.rating,
	reviewCount: p.qtdRatings,
});

const CategoryProducts = () => {
	const { slug } = useParams();
	const itemsPerPage = 12;
	const [currentPage, setCurrentPage] = useState(1);
	const resultsRef = useRef(null);

	const {
		data: categories,
		isLoading: catLoading,
		isError: catError,
	} = useCategories();

	const category = useMemo(() => {
		if (!categories) return null;
		return categories.find((cat) => slugify(cat.name) === slug) || null;
	}, [categories, slug]);

	const categoryId = category?.id;
	const categoryName = category?.name || '';

	useDocumentTitle(
		categoryName ? `${categoryName} - Kusumba` : 'Categoria - Kusumba'
	);

	const queryParams = useMemo(
		() => ({
			page: currentPage,
			limit: itemsPerPage,
			...(categoryId && { categoryIds: String(categoryId) }),
		}),
		[currentPage, categoryId]
	);

	const {
		data: productsData,
		isLoading: productsLoading,
		isError: productsError,
	} = useQuery({
		queryKey: ['products', 'by-category', queryParams],
		queryFn: async () => {
			const res = await getProducts(queryParams);
			if (!res.success) throw new Error(res.msg || 'Erro ao carregar produtos');
			const items = (res.data?.products || []).map(normalizeProduct);
			return {
				products: items,
				total: res.data?.pagination?.total || 0,
				totalPages: res.data?.pagination?.totalPages || 1,
			};
		},
		enabled: Boolean(categoryId),
		staleTime: 1000 * 60 * 2,
		refetchOnMount: 'always',
	});

	const products = productsData?.products || [];
	const totalResults = productsData?.total || 0;
	const totalPages = productsData?.totalPages || 1;

	useEffect(() => {
		if (resultsRef.current) {
			resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}, [currentPage]);

	const startResult = totalResults > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
	const endResult = Math.min(currentPage * itemsPerPage, totalResults);

	const isLoading = catLoading || (categoryId && productsLoading);
	const isNotFound = !catLoading && !catError && categories && !category;

	if (isNotFound) {
		return (
			<>
				<Header />
				<div className="min-h-screen bg-[var(--cat-page-bg)] flex flex-col items-center justify-center px-4 text-center">
					<div className="cat-page-empty-float mb-6">
						<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
							<circle cx="40" cy="40" r="36" stroke="#F97316" strokeWidth="2.5" fill="#FFF7ED" opacity="0.5" />
							<path d="M40 28V44" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
							<circle cx="40" cy="52" r="2" fill="#F97316" />
						</svg>
					</div>
					<h1 className="text-2xl font-bold text-[var(--cat-page-charcoal)] mb-2" style={{ fontFamily: '"Fredoka", sans-serif' }}>
						Categoria não encontrada
					</h1>
					<p className="text-sm text-[var(--cat-page-muted)] mb-8 max-w-md">
						A categoria que procuras não existe ou foi removida.
					</p>
					<Link
						to="/categorias"
						className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--cat-page-accent)] hover:bg-[var(--cat-page-accent-dark)] transition-all duration-300"
					>
						<IoArrowBack size={16} />
						Ver todas as categorias
					</Link>
				</div>
			</>
		);
	}

	return (
		<>
			<Header />
			<div className="min-h-screen bg-[var(--cat-page-bg)] flex flex-col">
				{/* ── Hero ── */}
				<section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a00] via-[#2d1300] to-[#3d1a00] text-white">
					<div className="cat-page-grain" />

					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<svg className="promocoes-wave absolute -top-10 -left-10 w-[120%] h-auto opacity-[0.07]" viewBox="0 0 1440 320" preserveAspectRatio="none">
							<path fill="#F97316" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
						</svg>
						<svg className="promocoes-wave-delayed absolute -bottom-10 -right-10 w-[120%] h-auto opacity-[0.05]" viewBox="0 0 1440 320" preserveAspectRatio="none">
							<path fill="#F97316" d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,186.7C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
						</svg>
					</div>

					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />

					{categoryName && (
						<span className="cat-page-hero-glyph">{categoryName.charAt(0)}</span>
					)}

					<div className="relative z-10 max-w-[1200px] mx-auto px-6 py-14 md:py-20">
						<Link
							to="/categorias"
							className="inline-flex items-center gap-1.5 text-orange-200/70 hover:text-orange-200 text-xs font-medium uppercase tracking-wider transition-colors mb-5"
						>
							<IoArrowBack size={14} />
							Categorias
						</Link>

						<div className="max-w-2xl">
							{isLoading ? (
								<>
									<div className="h-4 w-32 cat-page-shimmer rounded mb-4" />
									<div className="h-12 w-64 cat-page-shimmer rounded mb-4" />
									<div className="h-4 w-48 cat-page-shimmer rounded" />
								</>
							) : (
								<>
									<div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 rounded-full px-4 py-1.5 text-orange-200 text-xs font-semibold uppercase tracking-wider mb-4">
										<span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping-soft" />
										{category?.products?.length || totalResults} produto{(category?.products?.length || totalResults) !== 1 ? 's' : ''}
									</div>
									<h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight" style={{ fontFamily: '"Fredoka", sans-serif' }}>
										{categoryName}
									</h1>
									{category?.description && (
										<p className="text-orange-100/70 text-sm md:text-base max-w-xl leading-relaxed">
											{category.description}
										</p>
									)}
								</>
							)}
						</div>
					</div>
				</section>

				{/* ── Products ── */}
				<section ref={resultsRef} className="flex-1 max-w-[1200px] mx-auto px-6 py-10 w-full">
					{/* Header */}
					<div className="flex items-center justify-between mb-8">
						<div>
							<h2 className="text-xl font-bold text-[var(--cat-page-charcoal)]" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								{categoryName || 'Produtos'}
							</h2>
							<div className="cat-page-ornament mt-2" />
						</div>
						{!productsLoading && totalResults > 0 && (
							<span className="text-sm text-[var(--cat-page-muted)] font-medium">
								Mostrando {startResult}-{endResult} de {totalResults}
							</span>
						)}
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
					) : productsError ? (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<div className="cat-page-empty-float mb-6">
								<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="40" cy="40" r="36" stroke="#F97316" strokeWidth="2.5" fill="#FFF7ED" opacity="0.5" />
									<path d="M40 28V44" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
									<circle cx="40" cy="52" r="2" fill="#F97316" />
								</svg>
							</div>
							<p className="text-base font-semibold text-[var(--cat-page-charcoal)] mb-1">
								Erro ao carregar produtos
							</p>
							<p className="text-sm text-[var(--cat-page-muted)]">
								Tenta novamente mais tarde.
							</p>
						</div>
					) : products.length > 0 ? (
						<>
							<ProductGrid products={products} />

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex justify-center items-center mt-10 gap-2">
									<button
										onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
										const pageNum =
											totalPages <= 7
												? i + 1
												: (() => {
													if (currentPage <= 3) return i + 1;
													if (currentPage >= totalPages - 2)
														return totalPages - 6 + i;
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
										onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<div className="cat-page-empty-float mb-6">
								<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="12" y="16" width="56" height="8" rx="3" stroke="#9a8c82" strokeWidth="1.5" fill="#f5f0eb" />
									<rect x="12" y="28" width="56" height="8" rx="3" stroke="#9a8c82" strokeWidth="1.5" fill="#f5f0eb" />
									<rect x="12" y="40" width="56" height="8" rx="3" stroke="#9a8c82" strokeWidth="1.5" fill="#f5f0eb" />
									<circle cx="40" cy="60" r="8" stroke="#9a8c82" strokeWidth="2" fill="none" />
									<path d="M36 60H44M40 56V64" stroke="#9a8c82" strokeWidth="1.5" strokeLinecap="round" />
								</svg>
							</div>
							<h3 className="text-xl font-bold text-[var(--cat-page-charcoal)] mb-2" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								Nenhum produto disponível
							</h3>
							<p className="text-sm text-[var(--cat-page-muted)] max-w-md mb-8">
								Ainda não existem produtos nesta categoria. Volta mais tarde.
							</p>
							<Link
								to="/categorias"
								className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--cat-page-accent)] hover:bg-[var(--cat-page-accent-dark)] transition-all duration-300"
							>
								<IoArrowBack size={16} />
								Explorar categorias
							</Link>
						</div>
					)}
				</section>
			</div>
		</>
	);
};

export default CategoryProducts;
