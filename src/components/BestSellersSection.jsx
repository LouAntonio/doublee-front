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
	image: product.image || '/images/logo/placeholder.png',
	rating: product.rating,
	reviewCount: product.qtdRatings ?? product.reviewCount,
});

const BestSellersSection = () => {
	const { data: rawProducts, isLoading } = useBestSellers();

	const products = (rawProducts?.products ?? rawProducts ?? []).map(normalizeForCard);

	const firstRow = products.slice(0, 5);
	const secondRow = products.slice(5, 10);

	const rowStyle = { display: 'flex', gap: '12px', marginBottom: '12px' };
	const cardWrapperStyle = { flex: '1 1 0', minWidth: 0 };

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
					{isLoading ? (
						<>
							<div className="h-6 bg-gray-200 rounded w-80 animate-pulse"></div>
							<div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
						</>
					) : (
						<>
							<h2 style={{ fontSize: '24px', fontWeight: '400', color: '#333', margin: 0 }}>
                Mais vendidos
							</h2>
							<Link to="/produtos?sort=best-sellers" style={{
								color: '#3483fa', fontSize: '14px', textDecoration: 'none', fontWeight: '400',
							}}>
                Ver mais
							</Link>
						</>
					)}
				</div>

				{isLoading ? (
					<>
						<div style={rowStyle}>
							{[1, 2, 3, 4, 5].map((_, i) => (
								<div key={`skel-1-${i}`} style={cardWrapperStyle}><ProductSkeleton /></div>
							))}
						</div>
						<div style={rowStyle}>
							{[1, 2, 3, 4, 5].map((_, i) => (
								<div key={`skel-2-${i}`} style={cardWrapperStyle}><ProductSkeleton /></div>
							))}
						</div>
					</>
				) : (
					<>
						{firstRow.length > 0 && (
							<div style={rowStyle}>
								{firstRow.map((product) => (
									<div key={product.id} style={cardWrapperStyle}><ProductCard product={product} /></div>
								))}
							</div>
						)}
						{secondRow.length > 0 && (
							<div style={rowStyle}>
								{secondRow.map((product) => (
									<div key={product.id} style={cardWrapperStyle}><ProductCard product={product} /></div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</section>
	);
};

export default BestSellersSection;
