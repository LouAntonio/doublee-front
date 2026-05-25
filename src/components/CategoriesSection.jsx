import React from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/queries/useCategories';

const slugify = (s) =>
	String(s).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const placeholderColors = [
	'from-stone-100 to-stone-200', 'from-amber-100 to-stone-200',
	'from-orange-100 to-stone-200', 'from-yellow-100 to-stone-200',
	'from-rose-100 to-stone-200', 'from-lime-100 to-stone-200',
	'from-sky-100 to-stone-200', 'from-violet-100 to-stone-200',
];

const CategoriesSection = () => {
	const { data: categories, isLoading, isError, refetch } = useCategories();

	if (isLoading) {
		return (
			<section className="w-full" style={{ backgroundColor: '#F5F2ED' }}>
				<div className="max-w-[1200px] mx-auto px-6 py-12">
					<div className="flex items-baseline justify-between mb-10">
						<div className="h-9 w-40 cat-shimmer rounded-lg" />
						<div className="h-5 w-32 cat-shimmer rounded" />
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{[...Array(8)].map((_, i) => (
							<div key={i} className="bg-white rounded-2xl overflow-hidden">
								<div className="aspect-[3/2] cat-shimmer" />
								<div className="p-4 space-y-2">
									<div className="h-4 w-3/4 cat-shimmer rounded" />
									<div className="h-3 w-1/3 cat-shimmer rounded" />
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (isError) {
		return (
			<section className="w-full" style={{ backgroundColor: '#F5F2ED' }}>
				<div className="max-w-[1200px] mx-auto px-6 py-12">
					<div className="flex flex-col items-center justify-center py-16 text-center">
						<p className="text-sm mb-4" style={{ color: '#78716C' }}>
              Não foi possível carregar as categorias.
						</p>
						<button
							onClick={() => refetch()}
							className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#F97316] hover:bg-[#EA580C] transition-all duration-300 cursor-pointer"
						>
              Tentar novamente
						</button>
					</div>
				</div>
			</section>
		);
	}

	if (!categories || categories.length === 0) return null;

	return (
		<section className="w-full" style={{ backgroundColor: '#F5F2ED' }}>
			<div className="max-w-[1200px] mx-auto px-6 py-12">
				<div className="flex items-baseline justify-between mb-10">
					<div>
						<span className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: '#78716C' }}>
              Navegue por
						</span>
						<h2 className="text-3xl md:text-4xl font-bold mt-1 leading-tight" style={{ color: '#1C1917' }}>
              Categorias
						</h2>
					</div>
					<Link to="/categorias" className="hidden sm:flex items-center gap-2 text-sm font-medium text-[#F97316] hover:text-[#EA580C] transition-colors duration-300 group">
            Explorar todas
						<span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
					</Link>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{categories.map((category, index) => (
						<Link
							key={category.id}
							to={`/categorias/${slugify(category.name)}`}
							className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm hover:-translate-y-1 hover:shadow-lg hover:border-[#F97316]/30 transition-all duration-[400ms] cat-animate-in"
							style={{ animationDelay: `${0.06 * index}s` }}
						>
							<div
								className="aspect-[3/2] bg-cover bg-center"
								style={category.image ? { backgroundImage: `url(${category.image})` } : undefined}
							>
								{!category.image && (
									<div className={`w-full h-full bg-gradient-to-br ${placeholderColors[index % placeholderColors.length]} flex items-center justify-center`}>
										<span className="select-none font-semibold" style={{ fontSize: '3rem', color: '#d6d3d1' }}>
											{category.name.charAt(0)}
										</span>
									</div>
								)}
							</div>
							<div className="p-4">
								<h3 className="font-semibold leading-snug" style={{ fontSize: '15px', color: '#1C1917' }}>
									{category.name}
								</h3>
								{category.products && (
									<p className="text-[13px] leading-relaxed mt-1" style={{ color: '#78716C' }}>
										{category.products.length} produto{category.products.length !== 1 ? 's' : ''}
									</p>
								)}
							</div>
						</Link>
					))}
				</div>

				<div className="sm:hidden flex justify-center mt-8">
					<Link to="/categorias" className="inline-flex items-center gap-2 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
            Explorar todas as categorias <span>→</span>
					</Link>
				</div>
			</div>
		</section>
	);
};

export default CategoriesSection;
