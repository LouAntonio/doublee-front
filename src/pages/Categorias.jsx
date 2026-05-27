import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/queries/useCategories';
import useDocumentTitle from '../hooks/useDocumentTitle';
import Header from '../components/Header';
import { IoSearchOutline } from 'react-icons/io5';
import './categorias/categorias.css';

const slugify = (s) =>
	String(s).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const placeholderColors = [
	'from-stone-100 to-stone-200', 'from-amber-100 to-stone-200',
	'from-orange-100 to-stone-200', 'from-yellow-100 to-stone-200',
	'from-rose-100 to-stone-200', 'from-lime-100 to-stone-200',
	'from-sky-100 to-stone-200', 'from-violet-100 to-stone-200',
];

const CategorySkeleton = () => (
	<div className="bg-white rounded-2xl overflow-hidden border border-[var(--cat-page-border)]">
		<div className="aspect-[3/2] cat-page-shimmer" />
		<div className="p-4 space-y-2">
			<div className="h-4 w-3/4 cat-page-shimmer rounded" />
			<div className="h-3 w-1/3 cat-page-shimmer rounded" />
		</div>
	</div>
);

const Categorias = () => {
	useDocumentTitle('Categorias - Kusumba');

	const { data: categories, isLoading, isError, refetch } = useCategories();
	const [searchQuery, setSearchQuery] = useState('');

	const filtered = useMemo(() => {
		if (!categories) return [];
		if (!searchQuery.trim()) return categories;
		const q = searchQuery.toLowerCase();
		return categories.filter((cat) => cat.name?.toLowerCase().includes(q));
	}, [categories, searchQuery]);

	return (
		<>
			<Header />
			<div className="min-h-screen bg-[var(--cat-page-bg)] flex flex-col">
				{/* ── Hero ── */}
				<section className="relative overflow-hidden bg-gradient-to-b from-[#1a0a00] via-[#2d1300] to-[#3d1a00] text-white">
					<div className="cat-page-grain" />

					{/* Decorative waves */}
					<div className="absolute inset-0 overflow-hidden pointer-events-none">
						<svg className="promocoes-wave absolute -top-10 -left-10 w-[120%] h-auto opacity-[0.07]" viewBox="0 0 1440 320" preserveAspectRatio="none">
							<path fill="#F97316" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,154.7C1248,149,1344,171,1392,181.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
						</svg>
						<svg className="promocoes-wave-delayed absolute -bottom-10 -right-10 w-[120%] h-auto opacity-[0.05]" viewBox="0 0 1440 320" preserveAspectRatio="none">
							<path fill="#F97316" d="M0,96L48,122.7C96,149,192,203,288,218.7C384,235,480,213,576,186.7C672,160,768,128,864,138.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" />
						</svg>
					</div>

					{/* Radial glow */}
					<div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />

					{/* Large decorative glyph */}
					<span className="cat-page-hero-glyph">C</span>

					<div className="relative z-10 max-w-[1200px] mx-auto px-6 py-16 md:py-24">
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/20 rounded-full px-4 py-1.5 text-orange-200 text-xs font-semibold uppercase tracking-wider mb-5">
								<span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping-soft" />
								Explore
							</div>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								Categorias
							</h1>
							<p className="text-orange-100/80 text-base md:text-lg max-w-xl leading-relaxed mb-8">
								Navegue por todas as nossas categorias e descubra produtos incríveis para cada necessidade.
							</p>

							{/* Search */}
							<div className="relative max-w-md">
								<IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--cat-page-muted)]" size={18} />
								<input
									type="text"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Pesquisar categorias..."
									className="cat-page-search w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none transition-all"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* ── Category Grid ── */}
				<section className="flex-1 max-w-[1200px] mx-auto px-6 py-12 w-full">
					{isLoading ? (
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
							{[...Array(8)].map((_, i) => (
								<CategorySkeleton key={i} />
							))}
						</div>
					) : isError ? (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<div className="cat-page-empty-float mb-6">
								<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
									<circle cx="40" cy="40" r="36" stroke="#F97316" strokeWidth="2.5" fill="#FFF7ED" opacity="0.5" />
									<path d="M40 28V44" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" />
									<circle cx="40" cy="52" r="2" fill="#F97316" />
								</svg>
							</div>
							<p className="text-base font-semibold text-[var(--cat-page-charcoal)] mb-1">
								Erro ao carregar categorias
							</p>
							<p className="text-sm text-[var(--cat-page-muted)] mb-6">
								Tenta novamente mais tarde.
							</p>
							<button
								onClick={() => refetch()}
								className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[var(--cat-page-accent)] hover:bg-[var(--cat-page-accent-dark)] transition-all duration-300 cursor-pointer"
							>
								Tentar novamente
							</button>
						</div>
					) : filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-center">
							<div className="cat-page-empty-float mb-6">
								<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="16" y="20" width="48" height="8" rx="3" stroke="#9a8c82" strokeWidth="2" fill="#f5f0eb" />
									<rect x="16" y="34" width="48" height="8" rx="3" stroke="#9a8c82" strokeWidth="2" fill="#f5f0eb" />
									<rect x="16" y="48" width="48" height="8" rx="3" stroke="#9a8c82" strokeWidth="2" fill="#f5f0eb" />
									<circle cx="40" cy="66" r="5" stroke="#9a8c82" strokeWidth="2" fill="none" />
									<path d="M38 66H42" stroke="#9a8c82" strokeWidth="1.5" strokeLinecap="round" />
								</svg>
							</div>
							<h3 className="text-xl font-bold text-[var(--cat-page-charcoal)] mb-2" style={{ fontFamily: '"Fredoka", sans-serif' }}>
								Nenhuma categoria encontrada
							</h3>
							<p className="text-sm text-[var(--cat-page-muted)] max-w-md">
								Nenhuma categoria corresponde a &ldquo;{searchQuery}&rdquo;. Tente outro termo.
							</p>
						</div>
					) : (
						<>
							<div className="flex items-end justify-between mb-8">
								<div>
									<h2 className="text-2xl font-bold text-[var(--cat-page-charcoal)]" style={{ fontFamily: '"Fredoka", sans-serif' }}>
										{searchQuery ? 'Resultados' : 'Todas as Categorias'}
									</h2>
									<div className="cat-page-ornament mt-2" />
								</div>
								<span className="text-sm text-[var(--cat-page-muted)] font-medium">
									{filtered.length} categoria{filtered.length !== 1 ? 's' : ''}
								</span>
							</div>

							<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
								{filtered.map((category, index) => (
									<Link
										key={category.id}
										to={`/categorias/${slugify(category.name)}`}
										className="bg-white rounded-2xl overflow-hidden border border-[var(--cat-page-border)] cat-page-card-hover cat-page-card-enter"
										style={{ animationDelay: `${0.06 * index}s` }}
									>
										<div
											className="aspect-[3/2] bg-cover bg-center relative overflow-hidden"
											style={category.image ? { backgroundImage: `url(${category.image})` } : undefined}
										>
											{category.image ? (
												<>
													<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
													<span className="cat-page-initial">{category.name.charAt(0)}</span>
												</>
											) : (
												<div className={`w-full h-full bg-gradient-to-br ${placeholderColors[index % placeholderColors.length]} relative`}>
													<span className="cat-page-initial" style={{ fontSize: '5rem', color: 'rgba(154, 140, 130, 0.2)' }}>
														{category.name.charAt(0)}
													</span>
												</div>
											)}
										</div>
										<div className="p-4 flex items-center justify-between">
											<div>
												<h3 className="font-display font-semibold leading-snug text-[var(--cat-page-charcoal)]" style={{ fontSize: '15px' }}>
													{category.name}
												</h3>
												{category.products && (
													<p className="text-[13px] leading-relaxed mt-0.5" style={{ color: '#9a8c82' }}>
														{category.products.length} produto{category.products.length !== 1 ? 's' : ''}
													</p>
												)}
											</div>
											<svg className="flex-shrink-0 text-[var(--cat-page-muted)] group-hover:text-[var(--cat-page-accent)] transition-colors" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
												<path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
											</svg>
										</div>
									</Link>
								))}
							</div>
						</>
					)}
				</section>
			</div>
		</>
	);
};

export default Categorias;
