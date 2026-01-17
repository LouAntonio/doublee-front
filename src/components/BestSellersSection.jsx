import React, { useRef, useState } from 'react';
import { IoChevronBack, IoChevronForward, IoCartOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/currency';
import { useCart } from '../context/CartContext';

const BestSellersSection = () => {
	const { addToCart } = useCart();
	const scrollContainerRef = useRef(null);
	const [showLeftArrow, setShowLeftArrow] = useState(false);
	const [showRightArrow, setShowRightArrow] = useState(true);

	const products = [
		{
			id: 1,
			title: 'Piscina Inflável Fun Redonda 1400l Com Kit...',
			oldPrice: 279,
			price: 159.90,
			discount: 42,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/4169E1/fff?text=Piscina'
		},
		{
			id: 2,
			title: 'Mangueira De Jardim 10m Metros Marqs Home...',
			oldPrice: 32.90,
			price: 28.89,
			discount: 12,
			installments: null,
			coupon: 'Cupom 6% OFF',
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/00A650/fff?text=Mangueira'
		},
		{
			id: 3,
			title: 'Piscina Banheira Inflável Redonda 450 Litro...',
			oldPrice: 112.62,
			price: 67.80,
			discount: 39,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/1E90FF/fff?text=Banheira'
		},
		{
			id: 4,
			title: 'Lona Térmica Para Piscinas 3 X 3 Thermocap Cor Verde',
			oldPrice: 181.44,
			price: 154.22,
			discount: 15,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/008B8B/fff?text=Lona'
		},
		{
			id: 5,
			title: 'Genco 3 Em 1 Múltipla Ação Balde 10kg Cloro Para...',
			oldPrice: null,
			price: 199.90,
			discount: null,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/FFD700/333?text=Genco'
		},
		{
			id: 6,
			title: 'Piscina Infantil Quadrada Estrutural Pvc 1500 Litros...',
			oldPrice: null,
			price: 232.99,
			discount: null,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/87CEEB/333?text=Piscina+Infantil'
		},
		{
			id: 7,
			title: 'Kit Limpeza Piscina Completo 7 Peças Aspirador...',
			oldPrice: 289.90,
			price: 189.90,
			discount: 34,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/4682B4/fff?text=Kit+Limpeza'
		},
		{
			id: 8,
			title: 'Bomba Filtrante Para Piscina 3785 L/h 110v...',
			oldPrice: 349,
			price: 259.90,
			discount: 25,
			installments: null,
			freeShipping: null,
			image: 'https://via.placeholder.com/200x200/5F9EA0/fff?text=Bomba'
		}
	];

	const scroll = (direction) => {
		if (scrollContainerRef.current) {
			const scrollAmount = direction === 'left' ? -300 : 300;
			scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		}
	};

	const checkScroll = () => {
		if (scrollContainerRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
			setShowLeftArrow(scrollLeft > 0);
			setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	return (
		<section style={{
			backgroundColor: 'transparent',
			display: 'flex',
			justifyContent: 'center',
			padding: '24px 0',
			marginBottom: '16px'
		}}>
			<div style={{
				width: 'calc(100% - 48px)',
				maxWidth: '1180px',
				backgroundColor: '#fff',
				borderRadius: '10px',
				padding: '20px 20px 8px 20px',
				boxShadow: '0 8px 24px rgba(0,0,0,0.08)'
			}}>
				{/* Header */}
				<div style={{
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
					marginBottom: '20px'
				}}>
					<h2 style={{
						fontSize: '24px',
						fontWeight: '400',
						color: '#333',
						margin: 0
					}}>
						Mais vendidos da semana em Piscinas e Acessórios
					</h2>
					<Link to="/mais-vendidos" style={{
						color: '#3483fa',
						fontSize: '14px',
						textDecoration: 'none',
						fontWeight: '400'
					}}>
						Ir para Mais vendidos
					</Link>
				</div>

				{/* Carousel Container */}
				<div style={{ position: 'relative' }}>
					{/* Left Arrow */}
					{showLeftArrow && (
						<button
							onClick={() => scroll('left')}
							style={{
								position: 'absolute',
								left: '-20px',
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: '#fff',
								border: '1px solid #ddd',
								borderRadius: '50%',
								width: '40px',
								height: '40px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#f5f5f5';
								e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#fff';
								e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
							}}
						>
							<IoChevronBack size={24} color="#333" />
						</button>
					)}

					{/* Right Arrow */}
					{showRightArrow && (
						<button
							onClick={() => scroll('right')}
							style={{
								position: 'absolute',
								right: '-20px',
								top: '50%',
								transform: 'translateY(-50%)',
								zIndex: 2,
								backgroundColor: '#fff',
								border: '1px solid #ddd',
								borderRadius: '50%',
								width: '40px',
								height: '40px',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
								boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
								transition: 'all 0.2s'
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor = '#f5f5f5';
								e.currentTarget.style.transform = 'translateY(-50%) scale(1.05)';
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor = '#fff';
								e.currentTarget.style.transform = 'translateY(-50%) scale(1)';
							}}
						>
							<IoChevronForward size={24} color="#333" />
						</button>
					)}

					{/* Products Container */}
					<div
						ref={scrollContainerRef}
						onScroll={checkScroll}
						style={{
							display: 'flex',
							gap: '12px',
							overflowX: 'auto',
							scrollbarWidth: 'none',
							msOverflowStyle: 'none',
							WebkitOverflowScrolling: 'touch',
							padding: '4px 0'
						}}
						className="hide-scrollbar"
					>
						{products.map((product) => (
							<div
								key={product.id}
								style={{
									flex: '0 0 220px',
									backgroundColor: '#fff',
									borderRadius: '6px',
									padding: '16px',
									cursor: 'pointer',
									transition: 'all 0.2s',
									border: '1px solid transparent'
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
											fontSize: '18px',
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

									{/* Installments */}
									{/* Parcelamento removido para contexto de Angola */}

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

									{/* Free Shipping */}
									{/* Frete grátis removido no contexto de Angola */}

									{/* Add to Cart Button */}
									<button
										onClick={(e) => {
											e.stopPropagation();
											addToCart({
												id: product.id,
												name: product.title,
												price: product.price,
												image: product.image
											});
										}}
										style={{
											width: '100%',
											marginTop: '12px',
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
							</div>
						))}
					</div>
				</div>


			</div>

			<style>{`
				.hide-scrollbar::-webkit-scrollbar {
					display: none;
				}
			`}</style>
		</section>
	);
};

export default BestSellersSection;
