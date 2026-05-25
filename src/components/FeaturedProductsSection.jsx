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

	const products = normalizeProducts(rawProducts?.products ?? rawProducts);

	const firstRow = products.slice(0, 4);
	const secondRow = products.slice(4, 8);

	const rowStyle = {
		display: 'flex',
		gap: '12px',
		marginBottom: '12px',
	};

	const cardWrapperStyle = {
		flex: '1 1 0',
		minWidth: 0,
	};

	if (isLoading && products.length === 0) {
		const skeletonRows = [1, 2, 3, 4];
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
					<div style={rowStyle}>
						{skeletonRows.map((_, i) => (
							<div key={`skel-1-${i}`} style={cardWrapperStyle}>
								<ProductSkeleton />
							</div>
						))}
					</div>
					<div style={rowStyle}>
						{skeletonRows.map((_, i) => (
							<div key={`skel-2-${i}`} style={cardWrapperStyle}>
								<ProductSkeleton />
							</div>
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
					<h2 style={{ fontSize: '24px', fontWeight: '400', color: '#333', margin: 0 }}>
            Produtos em destaque
					</h2>
					<Link to="/produtos?featured=true" style={{
						color: '#3483fa', fontSize: '14px', textDecoration: 'none', fontWeight: '400',
					}}>
            Ver mais destaques
					</Link>
				</div>

				{firstRow.length > 0 && (
					<div style={rowStyle}>
						{firstRow.map((product) => (
							<div key={product.id} style={cardWrapperStyle}>
								<ProductCard product={product} />
							</div>
						))}
						{Array.from({ length: Math.max(0, 4 - firstRow.length) }).map((_, i) => (
							<div key={`empty-1-${i}`} style={cardWrapperStyle} />
						))}
					</div>
				)}

				{secondRow.length > 0 && (
					<div style={rowStyle}>
						{secondRow.map((product) => (
							<div key={product.id} style={cardWrapperStyle}>
								<ProductCard product={product} />
							</div>
						))}
						{Array.from({ length: Math.max(0, 4 - secondRow.length) }).map((_, i) => (
							<div key={`empty-2-${i}`} style={cardWrapperStyle} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default FeaturedProductsSection;
