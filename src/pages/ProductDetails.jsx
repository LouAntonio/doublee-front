import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoCartOutline, IoStar, IoStarOutline, IoHeartOutline, IoHeart, IoChevronForward, IoShieldCheckmarkOutline, IoStorefrontOutline, IoCheckmarkCircleOutline, IoChatbubbleOutline, IoSearch, IoTimerOutline } from 'react-icons/io5';
import Header from '../components/Header';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/currency';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { notyf } from '../utils/notyf';
import apiRequest from '../services/api';

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { addToCart, isAddingProduct } = useCart();
	const [product, setProduct] = useState(null);
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [loading, setLoading] = useState(true);
	const [wishlisted, setWishlisted] = useState(false);
	// Countdown timer for promotions
	const [countdown, setCountdown] = useState(null);

	useEffect(() => {
		if (!product?.promotionEndDate) return;

		const calcRemaining = () => {
			const end = new Date(product.promotionEndDate).getTime();
			const now = Date.now();
			const diff = end - now;
			if (diff <= 0) {
				setCountdown(null);
				return;
			}
			const days = Math.floor(diff / (1000 * 60 * 60 * 24));
			const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);
			setCountdown({ days, hours, minutes, seconds });
		};

		calcRemaining();
		const timer = setInterval(calcRemaining, 1000);
		return () => clearInterval(timer);
	}, [product]);

	const handleToggleWishlist = () => {
		const newState = !wishlisted;
		setWishlisted(newState);
		if (newState) {
			notyf.success('Adicionado à wishlist!');
		} else {
			notyf.error('Removido da wishlist');
		}
	};

	useDocumentTitle(product ? product.title + ' - Double E' : 'Detalhes do Produto - Double E');

	useEffect(() => {
		let mounted = true;
		const fetchProduct = async () => {
			setLoading(true);
			const res = await apiRequest(`/products/${id}`);
			if (!mounted) return;

			if (res && res.success && res.data?.product) {
				const p = res.data.product;

				const mappedProduct = {
					id: p.id,
					title: p.name,
					price: p.promotionalPrice || p.price,
					oldPrice: p.promotionalPrice ? p.price : undefined,
					discount: p.promotionalPrice && p.price ? Math.round(((p.price - p.promotionalPrice) / p.price) * 100) : 0,
					promotionEndDate: p.promotionalEndDate,
					images: p.image || p.gallery?.length ? [p.image, ...(p.gallery || [])].filter(Boolean) : ['/images/logo/placeholder.png'],
					category: p.categories?.[0]?.name || 'Diversos',
					brand: 'Double E',
					description: p.description || 'Sem descrição.',
					rating: p.rating || 0,
					reviews: p.qtdRatings || 0,
					stock: p.stock || 0,
					features: [],
					specs: (() => {
						if (!p.characteristics) return [];
						try {
							const chars = typeof p.characteristics === 'string' ? JSON.parse(p.characteristics) : p.characteristics;
							if (Array.isArray(chars)) return chars;
							if (typeof chars === 'object' && chars !== null) {
								return Object.entries(chars).map(([k, v]) => ({ label: k, value: String(v) }));
							}
							return [{ label: 'Detalhe', value: String(chars) }];
						} catch (e) {
							console.error('Error parsing characteristics:', e);
							return [{ label: 'Detalhe', value: String(p.characteristics) }];
						}
					})(),
					opinions: [],
					seller: {
						name: p.store?.name || 'Loja Desconhecida',
						logo: p.store?.logo || 'https://via.placeholder.com/100x60/1a6e1a/fff?text=LOJA',
						rating: p.store?.rating || 0,
					}
				};
				setProduct(mappedProduct);
			} else {
				setProduct(null);
			}
			setLoading(false);
		};

		fetchProduct();
		return () => { mounted = false; };
	}, [id]);

	const handleAddToCart = () => {
		if (product) {
			addToCart(product, quantity);
		}
	};

	const incrementQuantity = () => {
		if (product && quantity < product.stock) {
			setQuantity(prev => prev + 1);
		}
	};

	const decrementQuantity = () => {
		if (quantity > 1) {
			setQuantity(prev => prev - 1);
		}
	};

	const renderStars = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			stars.push(
				i <= rating
					? <IoStar key={i} style={{ color: '#FFD700', fontSize: '18px' }} />
					: <IoStarOutline key={i} style={{ color: '#FFD700', fontSize: '18px' }} />
			);
		}
		return stars;
	};

	if (loading) {
		return (
			<div className="bg-[#f5f5f5] min-h-screen flex flex-col">
				<Header />
				<div className="max-w-[1200px] w-full mx-auto p-5 flex-1 animate-pulse">
					{/* Breadcrumb Skeleton */}
					<div className="flex items-center gap-2 mb-6">
						<div className="w-16 h-4 bg-gray-200 rounded" />
						<IoChevronForward size={12} className="text-gray-300" />
						<div className="w-20 h-4 bg-gray-200 rounded" />
						<IoChevronForward size={12} className="text-gray-300" />
						<div className="w-48 h-4 bg-gray-200 rounded" />
					</div>

					{/* Container Principal Skeleton */}
					<div className="grid grid-cols-1 md:grid-cols-[auto_1fr_300px] bg-white rounded-lg overflow-hidden mb-8 shadow-sm border border-gray-100">
						{/* Coluna Esquerda - Imagens */}
						<div className="flex gap-3 p-6 border-r border-gray-100 items-start">
							{/* Miniaturas Verticais */}
							<div className="flex flex-col gap-2">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="w-14 h-14 bg-gray-200 rounded-md" />
								))}
							</div>
							{/* Imagem Principal */}
							<div className="w-[340px] h-[400px] bg-gray-200 rounded-md" />
						</div>

						{/* Coluna Central - Info */}
						<div className="p-6 border-r border-gray-100">
							<div className="w-3/4 h-6 bg-gray-200 rounded mb-4" />
							<div className="w-1/2 h-6 bg-gray-200 rounded mb-6" />

							<div className="w-32 h-4 bg-gray-200 rounded mb-8 pb-4 border-b border-gray-100" />

							<div className="w-40 h-10 bg-gray-200 rounded mb-4" />
							<div className="w-24 h-4 bg-gray-200 rounded mb-6" />

							<div className="w-3/4 h-16 bg-gray-100 rounded mb-6" />
						</div>

						{/* Coluna Direita - Ação */}
						<div className="p-6 flex flex-col gap-4">
							<div className="w-full h-10 bg-gray-100 rounded" />
							<div className="w-32 h-5 bg-gray-200 rounded mb-2" />
							<div className="w-full h-10 bg-gray-200 rounded border border-gray-300" />
							<div className="w-full h-12 bg-gray-200 rounded-lg shadow mt-2" />

							<div className="w-full h-32 bg-gray-100 rounded-lg mt-4 border border-gray-200" />
						</div>
					</div>

					{/* Descrição Skeleton */}
					<div className="bg-white rounded-lg p-8 mb-4 shadow-sm border border-gray-100">
						<div className="w-40 h-6 bg-gray-200 rounded mb-6" />
						<div className="space-y-3">
							<div className="w-full h-4 bg-gray-200 rounded" />
							<div className="w-full h-4 bg-gray-200 rounded" />
							<div className="w-5/6 h-4 bg-gray-200 rounded" />
							<div className="w-2/3 h-4 bg-gray-200 rounded" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div>
				<Header />
				<div style={{
					maxWidth: '1200px',
					margin: '0 auto',
					padding: '40px 20px',
					textAlign: 'center'
				}}>
					<h2>Produto não encontrado</h2>
					<button
						onClick={() => navigate('/')}
						style={{
							marginTop: '20px',
							padding: '12px 24px',
							backgroundColor: '#1a6e1a',
							color: 'white',
							border: 'none',
							borderRadius: '6px',
							cursor: 'pointer'
						}}
					>
						Voltar à página inicial
					</button>
				</div>
			</div>
		);
	}

	const isAdding = product ? isAddingProduct(product.id) : false;

	return (
		<div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
			<Header />

			<div style={{
				maxWidth: '1200px',
				margin: '0 auto',
				padding: '20px'
			}}>
				{/* Breadcrumb */}
				<div style={{
					display: 'flex',
					alignItems: 'center',
					gap: '8px',
					marginBottom: '24px',
					fontSize: '13px',
					color: '#666'
				}}>
					<span onClick={() => navigate('/')} style={{ cursor: 'pointer', color: '#3483fa' }}>
						Início
					</span>
					<IoChevronForward size={12} />
					<span onClick={() => navigate('/categorias')} style={{ cursor: 'pointer', color: '#3483fa' }}>
						{product.category}
					</span>
					<IoChevronForward size={12} />
					<span>{product.title.substring(0, 30)}...</span>
				</div>

				{/* Container Principal */}
				<div style={{
					display: 'grid',
					gridTemplateColumns: 'auto 1fr 300px',
					gap: '0',
					marginBottom: '32px',
					backgroundColor: 'white',
					borderRadius: '8px',
					overflow: 'hidden'
				}}>
					{/* Coluna Esquerda - Imagens */}
					<div style={{
						display: 'flex',
						gap: '12px',
						padding: '24px',
						borderRight: '1px solid #f0f0f0',
						alignItems: 'flex-start'
					}}>
						{/* Miniaturas Verticais */}
						<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
							{product.images.map((img, index) => (
								<div
									key={index}
									onClick={() => setSelectedImage(index)}
									style={{
										width: '56px',
										height: '56px',
										border: selectedImage === index ? '2px solid #3483fa' : '1px solid #ddd',
										borderRadius: '6px',
										overflow: 'hidden',
										cursor: 'pointer',
										flexShrink: 0,
										backgroundColor: 'white'
									}}
								>
									<img
										src={img}
										alt={`${product.title} ${index + 1}`}
										style={{ width: '100%', height: '100%', objectFit: 'cover' }}
									/>
								</div>
							))}
						</div>

						{/* Imagem Principal */}
						<div style={{ position: 'relative', width: '340px', flexShrink: 0 }}>
							<button
								onClick={handleToggleWishlist}
								title={wishlisted ? 'Remover da wishlist' : 'Adicionar à wishlist'}
								style={{
									position: 'absolute',
									top: '0',
									right: '0',
									width: '36px',
									height: '36px',
									border: 'none',
									backgroundColor: 'transparent',
									borderRadius: '50%',
									cursor: 'pointer',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									zIndex: 1
								}}
							>
								{wishlisted ? (
									<IoHeart size={22} color="#e74c3c" />
								) : (
									<IoHeartOutline size={22} color="#aaa" />
								)}
							</button>
							<img
								src={product.images[selectedImage]}
								alt={product.title}
								style={{
									width: '100%',
									height: '400px',
									objectFit: 'contain'
								}}
							/>
						</div>
					</div>

					{/* Coluna Central - Informações do Produto */}
					<div style={{ padding: '24px', borderRight: '1px solid #f0f0f0' }}>

						{/* Título */}
						<h1 style={{ fontSize: '20px', fontWeight: '400', color: '#333', margin: '0 0 12px 0', lineHeight: '1.35' }}>
							{product.title}
						</h1>

						{/* Rating */}
						<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
							<span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{product.rating}</span>
							<div style={{ display: 'flex', gap: '2px' }}>
								{renderStars(Math.floor(product.rating))}
							</div>
							<span style={{ color: '#3483fa', fontSize: '13px', cursor: 'pointer' }}>
								({product.reviews} avaliações)
							</span>
						</div>

						{/* Preço */}
						<div style={{ marginBottom: '16px' }}>
							{product.oldPrice && (
								<span style={{ fontSize: '14px', color: '#999', textDecoration: 'line-through' }}>
									{formatCurrency(product.oldPrice)}
								</span>
							)}
							<div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px', marginBottom: '4px' }}>
								<span style={{ fontSize: '36px', fontWeight: '300', color: '#333', lineHeight: 1 }}>
									{Math.floor(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
								</span>
								<span style={{ fontSize: '18px', fontWeight: '400', color: '#333', alignSelf: 'flex-start', marginTop: '8px' }}>
									{`,${(product.price % 1).toFixed(2).slice(2)}`}
								</span>
								<span style={{ fontSize: '15px', color: '#555', alignSelf: 'flex-end', marginBottom: '3px' }}>Kz</span>
								{product.discount && (
									<span style={{ padding: '3px 6px', backgroundColor: '#e8f5e9', color: '#1a6e1a', borderRadius: '4px', fontSize: '13px', fontWeight: '700' }}>
										{product.discount}% OFF
									</span>
								)}
							</div>
							{/* Contador da promoção */}
							{product.promotionEndDate && countdown && (
								<div style={{
									display: 'flex',
									alignItems: 'center',
									gap: '8px',
									marginTop: '10px',
									padding: '10px 14px',
									backgroundColor: '#fff3e0',
									borderRadius: '8px',
									border: '1px solid #ffcc80'
								}}>
									<IoTimerOutline size={18} color="#e65100" />
									<span style={{ fontSize: '12px', color: '#e65100', fontWeight: '600' }}>Promoção termina em:</span>
									<div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
										{[{ label: 'dias', value: countdown.days }, { label: 'h', value: countdown.hours }, { label: 'min', value: countdown.minutes }, { label: 's', value: countdown.seconds }].map(({ label, value }) => (
											<div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
												<span style={{
													backgroundColor: '#e65100',
													color: 'white',
													padding: '2px 7px',
													borderRadius: '4px',
													fontWeight: '700',
													fontSize: '13px',
													minWidth: '26px',
													textAlign: 'center'
												}}>
													{String(value).padStart(2, '0')}
												</span>
												<span style={{ fontSize: '10px', color: '#e65100', marginTop: '2px' }}>{label}</span>
											</div>
										))}
									</div>
								</div>
							)}
							{product.pricePerUnit && (
								<div style={{ fontSize: '12px', color: '#666', marginBottom: '6px' }}>
									{product.pricePerUnit}
								</div>
							)}

						</div>

						{/* Cupom */}
						{product.coupon && (
							<div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', backgroundColor: '#f5f5f5', borderRadius: '6px', marginBottom: '20px' }}>
								<span style={{ backgroundColor: '#3483fa', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
									🏷️ Cupom
								</span>
								<span style={{ fontSize: '13px', color: '#333' }}>{product.coupon}</span>
							</div>
						)}



						{/* Opções de compra */}
						{product.purchaseOptions && (
							<div style={{ paddingTop: '16px', borderTop: '1px solid #f0f0f0' }}>
								<div style={{ fontSize: '14px', fontWeight: '500', color: '#333', marginBottom: '6px' }}>Opções de compra:</div>
								<span style={{ fontSize: '13px', color: '#3483fa', cursor: 'pointer' }}>
									{product.purchaseOptions.count} produtos novos a partir de {formatCurrency(product.purchaseOptions.minPrice)}
								</span>
							</div>
						)}
					</div>

					{/* Coluna Direita - Ação + Loja */}
					<div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

						{/* Widget de Compra */}
						<div>
							{/* Stock */}
							<div style={{ padding: '10px 12px', backgroundColor: product.stock > 10 ? '#e8f5e9' : '#fff3e0', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
								<span style={{ color: product.stock > 10 ? '#1a6e1a' : '#f57c00', fontWeight: '500' }}>
									{product.stock > 10 ? `✓ Em estoque` : `⚠ Últimas ${product.stock} unidades!`}
								</span>
							</div>

							{/* Quantidade */}
							<div style={{ marginBottom: '16px' }}>
								<label style={{
									display: 'block',
									marginBottom: '8px',
									fontWeight: '500',
									fontSize: '14px',
									color: '#333'
								}}>
									Quantidade:
								</label>
								<div style={{
									display: 'inline-flex',
									alignItems: 'center',
									border: '1px solid #ddd',
									borderRadius: '6px',
									overflow: 'hidden',
									backgroundColor: 'white'
								}}>
									<button
										onClick={decrementQuantity}
										disabled={quantity <= 1}
										style={{
											width: '35px',
											height: '35px',
											border: 'none',
											backgroundColor: 'transparent',
											cursor: quantity <= 1 ? 'not-allowed' : 'pointer',
											fontSize: '16px',
											color: quantity <= 1 ? '#ccc' : '#333'
										}}
									>
										−
									</button>
									<div style={{
										minWidth: '45px',
										height: '35px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										borderLeft: '1px solid #ddd',
										borderRight: '1px solid #ddd',
										fontWeight: '400',
										fontSize: '15px'
									}}>
										{quantity}
									</div>
									<button
										onClick={incrementQuantity}
										disabled={quantity >= product.stock}
										style={{
											width: '35px',
											height: '35px',
											border: 'none',
											backgroundColor: 'transparent',
											cursor: quantity >= product.stock ? 'not-allowed' : 'pointer',
											fontSize: '16px',
											color: quantity >= product.stock ? '#ccc' : '#333'
										}}
									>
										+
									</button>
								</div>
								<div style={{
									marginTop: '8px',
									fontSize: '13px',
									color: '#666'
								}}>
									({product.stock} disponíveis)
								</div>
							</div>

							{/* Botões de Ação */}
							<button
								onClick={handleAddToCart}
								disabled={product.stock === 0 || isAdding}
								style={{
									width: '100%',
									padding: '13px',
									backgroundColor: 'white',
									color: '#3483fa',
									border: '1px solid #3483fa',
									borderRadius: '6px',
									fontSize: '15px',
									fontWeight: '500',
									cursor: product.stock === 0 || isAdding ? 'not-allowed' : 'pointer',
									transition: 'all 0.2s',
									opacity: isAdding ? 0.7 : 1,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									gap: '8px',
								}}
								onMouseEnter={(e) => { if (product.stock > 0 && !isAdding) e.currentTarget.style.backgroundColor = '#f5f7fa'; }}
								onMouseLeave={(e) => { if (product.stock > 0 && !isAdding) e.currentTarget.style.backgroundColor = 'white'; }}
							>
								{isAdding && (
									<span
										style={{
											width: '16px',
											height: '16px',
											border: '2px solid #3483fa',
											borderTop: '2px solid transparent',
											borderRadius: '999px',
											display: 'inline-block',
											animation: 'spin 0.8s linear infinite'
										}}
										aria-label="Adicionando"
									/>
								)}
								{isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
							</button>

							{/* Benefícios */}
							<div style={{ paddingTop: '14px', borderTop: '1px solid #f0f0f0', marginTop: '14px' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
									<IoShieldCheckmarkOutline size={18} color="#1a6e1a" />
									<div style={{ fontSize: '12px', color: '#666' }}>Compra Segura Garantida</div>
								</div>
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
									<IoStorefrontOutline size={18} color="#3483fa" />
									<div style={{ fontSize: '12px', color: '#666' }}>Devolução em 3 dias</div>
								</div>
							</div>
						</div>

						{/* Card da Loja */}
						<div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
							{/* Banner */}
							<div style={{ background: 'linear-gradient(135deg, #cc0000, #880000)', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
								<span style={{ color: 'white', fontWeight: '700', fontSize: '13px', letterSpacing: '1px' }}>LOJA OFICIAL</span>
							</div>
							{/* Info */}
							<div style={{ padding: '14px' }}>
								<div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
									<img src={product.seller.logo} alt={product.seller.name} style={{ width: '36px', height: '36px', objectFit: 'contain', borderRadius: '50%' }} />
									<div style={{ flex: 1 }}>
										<div style={{ fontSize: '13px', fontWeight: '600', color: '#333' }}>{product.seller.name}</div>
									</div>
									<button style={{ padding: '5px 12px', backgroundColor: 'transparent', color: '#3483fa', border: '1px solid #3483fa', borderRadius: '4px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
										Ver Mais
									</button>
								</div>
								{product.seller.experience && (
									<div style={{ fontSize: '11px', color: '#1a6e1a', fontWeight: '500', marginBottom: '10px' }}>
										{product.seller.experience}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				<div style={{
					backgroundColor: 'white',
					borderRadius: '8px',
					padding: '32px',
					marginBottom: '16px'
				}}>
					<h2 style={{
						fontSize: '20px',
						fontWeight: '600',
						color: '#333',
						marginBottom: '24px'
					}}>
						Descrição
					</h2>
					<p style={{
						fontSize: '15px',
						lineHeight: '1.8',
						color: '#666',
						marginBottom: '0'
					}}>
						{product.description}
					</p>
				</div>

				{/* Características Técnicas */}
				<div className="bg-white rounded-lg p-8">
					<h2 className="text-xl font-semibold text-gray-800 mb-6">
						Características principais
					</h2>
					<div className="rounded-lg overflow-hidden border border-gray-200">
						{product.specs.map((spec, index) => (
							<div
								key={index}
								className={`flex items-center px-6 py-4 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}`}
							>
								<span className="w-1/2 text-sm font-semibold text-gray-700">{spec.label}</span>
								<span className="w-1/2 text-sm text-gray-600">{spec.value}</span>
							</div>
						))}
					</div>
				</div>

				{/* Avaliações do produto */}
				{product.opinions && product.opinions.length > 0 && (
					<div style={{ backgroundColor: 'white', borderRadius: '8px', padding: '32px', marginTop: '16px' }}>
						{/* Cabeçalho */}
						<h2 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '28px' }}>
							Avaliações dos clientes
						</h2>

						{/* Resumo geral */}
						<div style={{
							display: 'flex',
							gap: '40px',
							alignItems: 'center',
							paddingBottom: '28px',
							borderBottom: '1px solid #f0f0f0',
							marginBottom: '28px',
							flexWrap: 'wrap'
						}}>
							{/* Nota global */}
							<div style={{ textAlign: 'center', minWidth: '110px' }}>
								<div style={{ fontSize: '64px', fontWeight: '200', color: '#1a6e1a', lineHeight: 1 }}>{product.rating.toFixed(1)}</div>
								<div style={{ display: 'flex', gap: '3px', justifyContent: 'center', margin: '8px 0 6px' }}>
									{renderStars(Math.round(product.rating))}
								</div>
								<div style={{ fontSize: '12px', color: '#888' }}>{product.reviews} avaliações</div>
							</div>

							{/* Barras de distribuição */}
							{product.ratingDistribution && (
								<div style={{ flex: 1, minWidth: '200px' }}>
									{[5, 4, 3, 2, 1].map((star) => {
										const total = Object.values(product.ratingDistribution).reduce((a, b) => a + b, 0);
										const count = product.ratingDistribution[star] || 0;
										const pct = total > 0 ? (count / total) * 100 : 0;
										return (
											<div key={star} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
												<span style={{ fontSize: '12px', color: '#555', width: '40px', textAlign: 'right', flexShrink: 0 }}>{star} ★</span>
												<div style={{ flex: 1, height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
													<div style={{ width: `${pct}%`, height: '100%', backgroundColor: pct > 60 ? '#1a6e1a' : pct > 30 ? '#8bc34a' : '#ffb300', borderRadius: '4px', transition: 'width 0.4s ease' }} />
												</div>
												<span style={{ fontSize: '12px', color: '#888', width: '36px', flexShrink: 0 }}>{count}</span>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{/* Lista de avaliações */}
						{product.opinions.map((opinion, idx) => (
							<div key={opinion.id} style={{
								padding: '20px 0',
								borderBottom: idx < product.opinions.length - 1 ? '1px solid #f5f5f5' : 'none'
							}}>
								{/* Topo: avatar + nome + data */}
								<div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
									<div style={{
										width: '38px', height: '38px',
										backgroundColor: '#e8f5e9', borderRadius: '50%',
										display: 'flex', alignItems: 'center', justifyContent: 'center',
										fontWeight: '700', fontSize: '12px', color: '#1a6e1a', flexShrink: 0
									}}>
										{opinion.avatar || opinion.user.substring(0, 2).toUpperCase()}
									</div>
									<div>
										<div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
											<span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>{opinion.user}</span>
											{opinion.verified && (
												<span style={{ fontSize: '11px', backgroundColor: '#e8f5e9', color: '#1a6e1a', padding: '2px 7px', borderRadius: '10px', fontWeight: '600' }}>
													✓ Compra verificada
												</span>
											)}
										</div>
										{opinion.date && (
											<div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{opinion.date}</div>
										)}
									</div>
								</div>

								{/* Estrelas + Título */}
								<div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
									<div style={{ display: 'flex', gap: '2px' }}>{renderStars(opinion.rating)}</div>
									<span style={{ fontSize: '14px', fontWeight: '600', color: '#222' }}>{opinion.title}</span>
								</div>

								{/* Comentário */}
								<p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', margin: '0 0 12px 0' }}>{opinion.comment}</p>

								{/* Útil? */}
								{opinion.helpful !== undefined && (
									<div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
										<span style={{ fontSize: '12px', color: '#999' }}>Esta avaliação foi útil?</span>
										<button style={{ fontSize: '12px', padding: '3px 10px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: 'transparent', cursor: 'pointer', color: '#555' }}>
											👍 Sim ({opinion.helpful})
										</button>
										<button style={{ fontSize: '12px', padding: '3px 10px', border: '1px solid #ddd', borderRadius: '12px', backgroundColor: 'transparent', cursor: 'pointer', color: '#555' }}>
											👎 Não
										</button>
									</div>
								)}
							</div>
						))}

						{/* Botão ver mais */}
						<div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center' }}>
							<button style={{
								padding: '12px 32px',
								backgroundColor: 'transparent',
								color: '#1a6e1a',
								border: '1px solid #1a6e1a',
								borderRadius: '6px',
								cursor: 'pointer',
								fontWeight: '600',
								fontSize: '14px'
							}}>
								Ver todas as {product.reviews} avaliações
							</button>
						</div>
					</div>
				)}

				{/* Perguntas e Respostas */}
				{product.questions && product.questions.length > 0 && (
					<div style={{
						backgroundColor: 'white',
						borderRadius: '8px',
						padding: '32px',
						marginTop: '16px'
					}}>
						<h2 style={{
							fontSize: '20px',
							fontWeight: '600',
							color: '#333',
							marginBottom: '24px'
						}}>
							Perguntas e respostas
						</h2>
						<div style={{ marginBottom: '24px' }}>
							<h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '12px' }}>Qual a sua dúvida?</h3>
							<div style={{ position: 'relative' }}>
								<input
									type="text"
									placeholder="Escreva sua pergunta..."
									style={{
										width: '100%',
										padding: '12px 40px 12px 16px',
										borderRadius: '6px',
										border: '1px solid #ddd',
										fontSize: '15px'
									}}
								/>
								<IoSearch size={20} color="#999" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
							</div>
						</div>

						<h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Últimas perguntas</h3>
						{product.questions.map((q) => (
							<div key={q.id} style={{ marginBottom: '20px' }}>
								<div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
									<IoChatbubbleOutline size={18} color="#666" />
									<p style={{ margin: 0, fontSize: '15px', color: '#333' }}>{q.question}</p>
								</div>
								<div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', paddingLeft: '26px' }}>
									<span style={{ color: '#999', fontSize: '20px', lineHeight: '1' }}>↳</span>
									<p style={{ margin: 0, fontSize: '14px', color: '#666', lineHeight: '1.5' }}>{q.answer}</p>
								</div>
							</div>
						))}
						<button style={{
							marginTop: '12px',
							padding: '12px 24px',
							backgroundColor: 'transparent',
							color: '#3483fa',
							border: '1px solid #3483fa',
							borderRadius: '6px',
							cursor: 'pointer',
							fontWeight: '500'
						}}>
							Ver todas as perguntas
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductDetails;
