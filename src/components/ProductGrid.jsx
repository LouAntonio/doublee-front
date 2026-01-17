import React from 'react';
import { formatCurrency } from '../utils/currency';

const ProductGrid = ({ products }) => {
	return (
		<div style={{
			display: 'grid',
			gridTemplateColumns: 'repeat(4, 1fr)',
			gap: '12px'
		}}>
			{products.map((product) => (
				<div
					key={product.id}
					style={{
						backgroundColor: '#fff',
						borderRadius: '6px',
						padding: '16px',
						cursor: 'pointer',
						transition: 'all 0.2s',
						border: '1px solid transparent',
						boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
						e.currentTarget.style.border = '1px solid #e5e5e5';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
						e.currentTarget.style.border = '1px solid transparent';
					}}
				>
					{/* Product Image */}
					<div style={{
						width: '100%',
						aspectRatio: '1',
						backgroundColor: '#f5f5f5',
						borderRadius: '4px',
						marginBottom: '12px',
						overflow: 'hidden',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<img
							src={product.image}
							alt={product.title}
							style={{
								width: '100%',
								height: '100%',
								objectFit: 'cover'
							}}
						/>
					</div>

					{/* Product Info */}
					<div>
						{/* Product Title */}
						<h3 style={{
							fontSize: '14px',
							fontWeight: '400',
							color: '#333',
							margin: '0 0 8px 0',
							lineHeight: '1.4',
							height: '40px',
							overflow: 'hidden',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical'
						}}>
							{product.title}
						</h3>

						{/* Old Price */}
						{product.oldPrice && (
							<div style={{
								fontSize: '11px',
								color: '#999',
								textDecoration: 'line-through',
								marginBottom: '4px'
							}}>
								{formatCurrency(product.oldPrice)}
							</div>
						)}

						{/* Price Container */}
						<div style={{
							display: 'flex',
							alignItems: 'baseline',
							gap: '6px',
							marginBottom: '4px'
						}}>
							<span style={{
								fontSize: '15px',
								fontWeight: '400',
								color: '#333'
							}}>
								{formatCurrency(product.price)}
							</span>
							{product.discount && (
								<span style={{
									fontSize: '14px',
									color: '#00a650',
									fontWeight: '600'
								}}>
									{product.discount}% OFF
								</span>
							)}
						</div>

						{/* Coupon */}
						{product.coupon && (
							<div style={{
								display: 'inline-block',
								backgroundColor: '#e8f4ff',
								color: '#3483fa',
								fontSize: '12px',
								padding: '3px 8px',
								borderRadius: '4px',
								marginBottom: '8px',
								fontWeight: '500'
							}}>
								🎟️ {product.coupon}
							</div>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default ProductGrid;
