import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import { useFeaturedProducts } from '../hooks/queries/useProducts';

const normalizeProducts = (products) =>
	(products || []).map((product) => ({
		id: product.id,
		title: product.name ?? product.title,
		price: product.promotionalPrice ?? product.price,
		oldPrice: product.promotionalPrice ? product.price : product.oldPrice,
		promotionalEndDate: product.promotionalEndDate,
		image: product.image || '/images/logo/placeholder.png',
		rating: product.rating,
		reviewCount: product.qtdRatings ?? product.reviewCount,
	}));

const FeaturedProductsSection = () => {
	const { data: rawProducts, isLoading } = useFeaturedProducts();

	const products = normalizeProducts(rawProducts?.products ?? rawProducts).slice(0, 20);

	if (isLoading && products.length === 0) {
		return (
			<section style={{
				backgroundColor: 'transparent',
				display: 'flex',
				justifyContent: 'center',
				padding: '24px 0',
				marginBottom: '16px',
			}}>
				<div style={{
					width: 'calc(100% - 48px)',
					maxWidth: '1180px',
					backgroundColor: '#fff',
					borderRadius: '10px',
					padding: '20px 20px 8px 20px',
					boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
				}}>
					<div style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						marginBottom: '20px',
					}}>
						<div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
						<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
					</div>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
						{[...Array(8)].map((_, i) => (
							<div key={i}><ProductSkeleton /></div>
						))}
					</div>
				</div>
			</section>
		);
	}

	if (!isLoading && products.length === 0) {
		return null;
	}

	return (
		<section style={{
			backgroundColor: 'transparent',
			display: 'flex',
			justifyContent: 'center',
			padding: '24px 0',
			marginBottom: '16px',
		}}>
			<div style={{
				width: 'calc(100% - 48px)',
				maxWidth: '1180px',
				backgroundColor: '#fff',
				borderRadius: '10px',
				padding: '20px 20px 8px 20px',
				boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
			}}>
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '20px',
				}}>
					<h2 className="font-display text-2xl text-[#1C1917] m-0">
                        Produtos em destaque
					</h2>
					<Link to="/produtos?featured=true" className="font-body text-sm text-accent hover:underline">
                        Ver mais destaques
					</Link>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
};

export default FeaturedProductsSection;
