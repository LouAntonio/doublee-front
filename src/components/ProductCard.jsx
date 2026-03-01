import React, { useState } from 'react';
import { IoCartOutline, IoHeartOutline, IoHeart } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';
import { notyf } from '../utils/notyf';

const ProductCard = ({ product, onClick }) => {
	const { addToCart } = useCart();
	const navigate = useNavigate();
	const handleProductClick = onClick ?? (() => navigate(`/produto/${product.id}`));
	const [wishlisted, setWishlisted] = useState(false);

	const handleAddToCart = (e) => {
		e.stopPropagation();
		addToCart({
			id: product.id,
			name: product.title,
			price: product.price,
			image: product.image
		});
	};

	const handleToggleWishlist = (e) => {
		e.stopPropagation();
		const newState = !wishlisted;
		setWishlisted(newState);
		if (newState) {
			notyf.success('Adicionado à wishlist!');
		} else {
			notyf.error('Removido da wishlist');
		}
	};

	return (
		<div
			style={{
				cursor: 'pointer',
				transition: 'all 0.2s',
				padding: '16px',
				borderRadius: '6px',
				border: '1px solid transparent',
				display: 'flex',
				flexDirection: 'column',
				flex: '1 1 0',
				minWidth: 0,
				height: '100%',
				boxSizing: 'border-box'
			}}
			onMouseEnter={(e) => {
				e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
				e.currentTarget.style.border = '1px solid #e5e5e5';
			}}
			onMouseLeave={(e) => {
				e.currentTarget.style.boxShadow = 'none';
				e.currentTarget.style.border = '1px solid transparent';
			}}
		>
			{/* Product Image + Wishlist */}
			<div
				style={{
					position: 'relative',
					width: '100%',
					aspectRatio: '1',
					backgroundColor: '#f5f5f5',
					borderRadius: '4px',
					marginBottom: '12px',
					overflow: 'hidden'
				}}
			>
				<div
					onClick={handleProductClick}
					style={{
						width: '100%',
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer'
					}}
				>
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

				{/* Wishlist Button */}
				<button
					onClick={handleToggleWishlist}
					title={wishlisted ? 'Remover da wishlist' : 'Adicionar à wishlist'}
					style={{
						position: 'absolute',
						top: '8px',
						right: '8px',
						width: '32px',
						height: '32px',
						borderRadius: '50%',
						border: 'none',
						backgroundColor: 'rgba(255,255,255,0.9)',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: 'pointer',
						boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
						transition: 'all 0.2s ease',
						transform: wishlisted ? 'scale(1.1)' : 'scale(1)'
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = '#fff';
						e.currentTarget.style.boxShadow = '0 3px 10px rgba(0,0,0,0.18)';
						if (!wishlisted) e.currentTarget.style.transform = 'scale(1.15)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.9)';
						e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.12)';
						e.currentTarget.style.transform = wishlisted ? 'scale(1.1)' : 'scale(1)';
					}}
				>
					{wishlisted ? (
						<IoHeart size={18} color="#e74c3c" />
					) : (
						<IoHeartOutline size={18} color="#666" />
					)}
				</button>

				{/* Featured Badge */}
				{product.isFeatured && (
					<div style={{
						position: 'absolute',
						top: '8px',
						left: '8px',
						backgroundColor: '#3483fa',
						color: '#fff',
						fontSize: '10px',
						fontWeight: '700',
						padding: '2px 8px',
						borderRadius: '4px',
						textTransform: 'uppercase',
						boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
						zIndex: 1
					}}>
                        Destaque
					</div>
				)}
			</div>

			{/* Product Info */}
			<div style={{
				display: 'flex',
				flexDirection: 'column',
				flex: 1
			}}>
				{/* Product Title */}
				<Link 
					to={`/produto/${product.id}`}
					style={{
						textDecoration: 'none',
						fontSize: '14px',
						fontWeight: '400',
						color: '#333',
						margin: '0 0 8px 0',
						lineHeight: '1.4',
						height: '40px',
						overflow: 'hidden',
						display: '-webkit-box',
						WebkitLineClamp: 2,
						WebkitBoxOrient: 'vertical',
						cursor: 'pointer'
					}}
				>
					{product.title}
				</Link>

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

				{/* Price + Discount */}
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

				{/* Add to Cart Button */}
				<button
					onClick={handleAddToCart}
					style={{
						width: '100%',
						marginTop: 'auto',
						padding: '8px 12px',
						backgroundColor: '#3483fa',
						color: '#fff',
						border: 'none',
						borderRadius: '6px',
						fontSize: '14px',
						fontWeight: '600',
						cursor: 'pointer',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: '6px',
						transition: 'all 0.2s'
					}}
					onMouseEnter={(e) => {
						e.currentTarget.style.backgroundColor = '#2968c8';
						e.currentTarget.style.transform = 'translateY(-1px)';
					}}
					onMouseLeave={(e) => {
						e.currentTarget.style.backgroundColor = '#3483fa';
						e.currentTarget.style.transform = 'translateY(0)';
					}}
				>
					<IoCartOutline size={16} />
                    Adicionar
				</button>
			</div>
		</div >
	);
};

export default ProductCard;
