import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import apiRequest from '../services/api';

const OffersSection = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchOffers = async () => {
			try {
				setLoading(true);
				const response = await apiRequest('/products/on-sale?limit=8');
				if (response.success && response.data?.products) {
					const normalized = response.data.products.map((product) => ({
						id: product.id,
						title: product.name ?? product.title,
						price: product.promotionalPrice ?? product.price,
						oldPrice: product.promotionalPrice ? product.price : product.oldPrice,
						image: product.image || '/images/logo/placeholder.png',
						rating: product.rating,
						reviewCount: product.qtdRatings ?? product.reviewCount
					}));
					setProducts(normalized);
				}
			} catch (error) {
				console.error('Erro ao buscar ofertas:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchOffers();
	}, []);

	if (loading && products.length === 0) {
		const skeletonRows = [1, 2, 3, 4];
		return (
			<section className="offers-section" style={{ backgroundColor: '#ededed', padding: '20px 0' }}>
				<div className="offers-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
					<div className="offers-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
						{/* Deal of the Day Skeleton - Left Side */}
						<div className="offers-deal" style={{
							flex: '0 0 320px',
							backgroundColor: '#fff',
							borderRadius: '6px',
							padding: '24px',
							boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
							display: 'flex',
							flexDirection: 'column'
						}}>
							<div className="h-8 bg-gray-200 rounded w-40 animate-pulse mb-5"></div>
							<div style={{ flex: 1 }}>
								<ProductSkeleton />
							</div>
						</div>

						{/* Offers Grid Skeleton - Right Side */}
						<div className="offers-grid-section" style={{
							flex: '1',
							backgroundColor: '#fff',
							borderRadius: '6px',
							padding: '24px',
							boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
							minWidth: '0'
						}}>
							<div style={{
								display: 'flex',
								alignItems: 'baseline',
								gap: '8px',
								marginBottom: '20px'
							}}>
								<div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
								<div className="h-4 bg-gray-200 rounded w-48 animate-pulse ml-2"></div>
							</div>

							{/* Row 1 Skeleton */}
							<div style={{
								display: 'flex',
								gap: '12px',
								marginBottom: '12px'
							}}>
								{skeletonRows.map((_, i) => (
									<div key={`skel-1-${i}`} style={{ flex: '1 1 0', minWidth: 0 }}>
										<ProductSkeleton />
									</div>
								))}
							</div>

							{/* Divider Skeleton */}
							<div style={{
								height: '1px',
								backgroundColor: '#eee',
								margin: '4px 0 12px 0'
							}} />

							{/* Row 2 Skeleton */}
							<div style={{
								display: 'flex',
								gap: '12px'
							}}>
								{skeletonRows.map((_, i) => (
									<div key={`skel-2-${i}`} style={{ flex: '1 1 0', minWidth: 0 }}>
										<ProductSkeleton />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>
		);
	}

	if (!loading && products.length === 0) {
		return null;
	}

	const dealCandidate = products.reduce((best, product, index) => {
		const oldPrice = Number(product?.oldPrice);
		const price = Number(product?.price);
		const hasValidDiscount = Number.isFinite(oldPrice) && Number.isFinite(price) && oldPrice > price && price > 0;
		const discount = hasValidDiscount ? (oldPrice - price) / oldPrice : 0;
		if (!best) return { product, index, discount };
		if (discount > best.discount) return { product, index, discount };
		return best;
	}, null);

	const dealOfTheDay = dealCandidate?.product ?? products[0];
	const dealIndex = dealCandidate?.index ?? 0;
	const offers = products.filter((_, index) => index !== dealIndex);

	const firstRow = offers.slice(0, 4);
	const secondRow = offers.slice(4, 8);

	const cardWrapperStyle = {
		flex: '1 1 0',
		minWidth: 0
	};

	return (
		<section className="offers-section" style={{ backgroundColor: '#ededed', padding: '20px 0' }}>
			<div className="offers-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
				<div className="offers-row" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
					{/* Deal of the Day - Left Side */}
					<div className="offers-deal" style={{
						flex: '0 0 320px',
						backgroundColor: '#fff',
						borderRadius: '6px',
						padding: '24px',
						boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
						display: 'flex',
						flexDirection: 'column'
					}}>
						<h2 style={{
							fontSize: '24px',
							fontWeight: '600',
							marginBottom: '20px',
							color: '#333'
						}}>
							Oferta do dia
						</h2>
						<div style={{ flex: 1 }}>
							{dealOfTheDay && <ProductCard product={dealOfTheDay} />}
						</div>
					</div>

					{/* Offers Grid - Right Side */}
					<div className="offers-grid-section" style={{
						flex: '1',
						backgroundColor: '#fff',
						borderRadius: '6px',
						padding: '24px',
						boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
						minWidth: '0'
					}}>
						<div style={{
							display: 'flex',
							alignItems: 'baseline',
							gap: '8px',
							marginBottom: '20px'
						}}>
							<h2 style={{
								fontSize: '24px',
								fontWeight: '600',
								color: '#333',
								margin: 0
							}}>
								Ofertas
							</h2>
							<Link to="/promocoes" style={{
								fontSize: '14px',
								color: '#3483fa',
								textDecoration: 'none',
								fontWeight: '600'
							}}>
								Mostrar todas as ofertas
							</Link>
						</div>

						{/* Row 1 */}
						{firstRow.length > 0 && (
							<div style={{
								display: 'flex',
								gap: '12px',
								marginBottom: '12px'
							}}>
								{firstRow.map((offer) => (
									<div key={offer.id} style={cardWrapperStyle}>
										<ProductCard product={offer} />
									</div>
								))}
								{Array.from({ length: Math.max(0, 4 - firstRow.length) }).map((_, i) => (
									<div key={`empty-1-${i}`} style={cardWrapperStyle} />
								))}
							</div>
						)}

						{/* Divider */}
						{firstRow.length > 0 && secondRow.length > 0 && (
							<div style={{
								height: '1px',
								backgroundColor: '#eee',
								margin: '4px 0 12px 0'
							}} />
						)}

						{/* Row 2 */}
						{secondRow.length > 0 && (
							<div style={{
								display: 'flex',
								gap: '12px'
							}}>
								{secondRow.map((offer) => (
									<div key={offer.id} style={cardWrapperStyle}>
										<ProductCard product={offer} />
									</div>
								))}
								{Array.from({ length: Math.max(0, 4 - secondRow.length) }).map((_, i) => (
									<div key={`empty-2-${i}`} style={cardWrapperStyle} />
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default OffersSection;
