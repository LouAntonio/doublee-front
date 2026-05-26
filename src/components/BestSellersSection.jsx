import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { useBestSellers } from '../hooks/queries/useProducts';

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

const BestSellersSection = () => {
	const { data: rawProducts, isLoading } = useBestSellers();

	const products = (rawProducts?.products ?? rawProducts ?? []).map(normalizeForCard).slice(0, 20);

	if (isLoading && products.length === 0) {
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
                        Mais vendidos
					</h2>
					<Link to="/produtos?sort=best-sellers" className="font-body text-sm text-accent hover:underline">
                        Ver mais
					</Link>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
					{products.length > 0 ? (
						products.map((product) => (
							<ProductCard key={product.id} product={product} />
						))
					) : (
						<div className="col-span-full text-center py-12">
							<p className="font-body text-lg text-gray-500">Não há produtos</p>
						</div>
					)}
				</div>
			</div>
		</section>
	);
};

export default BestSellersSection;
