import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IoAppsOutline } from 'react-icons/io5';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { useProducts } from '../hooks/queries/useProducts';

const normalizeForCard = (product) => ({
	id: product.id,
	title: product.name ?? product.title,
	price: product.promotionalPrice ?? product.price,
	oldPrice: product.promotionalPrice ? product.price : product.oldPrice,
	promotionalEndDate: product.promotionalEndDate,
	image: product.image || '/images/produto.png',
	rating: product.rating,
	reviewCount: product.qtdRatings ?? product.reviewCount,
});

const LatestProductsSection = () => {
	const [page, setPage] = useState(1);
	const [allProducts, setAllProducts] = useState([]);
	const loadedPagesRef = useRef(new Set());

	const { data, isLoading, isFetching } = useProducts({ sort: 'newest', limit: 10, page });
	const total = data?.total ?? 0;

	useEffect(() => {
		const products = data?.products ?? [];
		if (products.length > 0 && !loadedPagesRef.current.has(page)) {
			loadedPagesRef.current.add(page);
			const normalized = products.map(normalizeForCard);
			setAllProducts(prev => [...prev, ...normalized]);
		}
	}, [data, page]);

	if (isLoading && allProducts.length === 0) {
		return (
			<section style={{
				backgroundColor: 'transparent', display: 'flex', justifyContent: 'center',
				padding: '24px 0', marginBottom: '16px',
			}}>
				<div style={{
					width: 'calc(100% - 48px)', maxWidth: '1180px', backgroundColor: '#fff',
					borderRadius: '10px', padding: '20px 20px 8px 20px',
					boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
				}}>
					<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
						<div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
					</div>
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
						{[...Array(10)].map((_, i) => (
							<div key={i}><ProductSkeleton /></div>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (!isLoading && allProducts.length === 0) {
		return null;
	}

	const hasMore = allProducts.length < total;

	return (
		<section style={{
			backgroundColor: 'transparent', display: 'flex', justifyContent: 'center',
			padding: '24px 0', marginBottom: '16px',
		}}>
			<div style={{
				width: 'calc(100% - 48px)', maxWidth: '1180px', backgroundColor: '#fff',
				borderRadius: '10px', padding: '20px 20px 8px 20px',
				boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
			}}>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
					<h2 className="font-display text-2xl text-[#1C1917] m-0">
						Mais recentes
					</h2>
					<Link to="/produtos?sort=newest" className="font-body text-sm text-accent hover:underline">
						Ver mais
					</Link>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
					{allProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{hasMore && (
					<div className="flex justify-center mt-6 pb-2">
						{isFetching ? (
							<span className="inline-block w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
						) : (
							<button
								onClick={() => setPage(p => p + 1)}
								className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-[#1C1917] hover:border-accent hover:text-accent transition-all duration-200"
							>
								<IoAppsOutline className="text-lg" />
								Carregar mais
							</button>
						)}
					</div>
				)}
			</div>
		</section>
	);
};

export default LatestProductsSection;
