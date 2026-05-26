import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { IoCartOutline, IoStarOutline, IoHeartOutline, IoHeart, IoChevronForward, IoShieldCheckmarkOutline, IoStorefrontOutline, IoCheckmarkCircleOutline, IoChatbubbleOutline, IoSearch, IoTimerOutline, IoStarSharp } from 'react-icons/io5';
import Header from '../components/Header';
import useCartStore from '../stores/cartStore';
import useAuthStore from '../stores/authStore';
import useWishlistStore from '../stores/wishlistStore';
import { formatCurrency } from '../utils/currency';
import { isPromotionActive } from '../utils/date';
import useDocumentTitle from '../hooks/useDocumentTitle';
import { notyf } from '../utils/notyf';
import { useProduct } from '../hooks/queries/useProducts';

const parseSpecs = (p) => {
	if (!p?.characteristics) return [];
	try {
		const chars = typeof p.characteristics === 'string' ? JSON.parse(p.characteristics) : p.characteristics;
		if (Array.isArray(chars)) return chars;
		if (typeof chars === 'object' && chars !== null) {
			return Object.entries(chars).map(([k, v]) => ({ label: k, value: String(v) }));
		}
		return [{ label: 'Detalhe', value: String(chars) }];
	} catch {
		return [{ label: 'Detalhe', value: String(p.characteristics) }];
	}
};

const mapProduct = (p) => {
	if (!p) return null;
	const hasValidPromotion = p.promotionalPrice && isPromotionActive(p.promotionalEndDate);
	return {
		id: p.id,
		title: p.name,
		price: hasValidPromotion ? p.promotionalPrice : p.price,
		oldPrice: hasValidPromotion ? p.price : undefined,
		discount: hasValidPromotion && p.price ? Math.round(((p.price - p.promotionalPrice) / p.price) * 100) : 0,
		promotionEndDate: p.promotionalEndDate,
		images: p.image || p.gallery?.length ? [p.image, ...(p.gallery || [])].filter(Boolean) : ['/images/produto.png'],
		category: p.categories?.[0]?.name || 'Diversos',
		brand: 'Kusumba',
		description: p.description || 'Sem descrição.',
		rating: p.rating || 0,
		reviews: p.qtdRatings || 0,
		stock: p.stock || 0,
		features: [],
		specs: parseSpecs(p),
		opinions: [],
		seller: {
			id: p.store?.id || null,
			name: p.store?.name || 'Loja Desconhecida',
			logo: p.store?.logo || 'https://via.placeholder.com/100x60/1a6e1a/fff?text=LOJA',
			rating: p.store?.rating || 0,
		},
	};
};

const ProductDetails = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { addToCart, isAddingProduct } = useCartStore();
	const { isAuthenticated } = useAuthStore();
	const { isWishlisted, checkInWishlist, toggleWishlist, isToggling } = useWishlistStore();
	const [selectedImage, setSelectedImage] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [countdown, setCountdown] = useState(null);

	const { data: rawData, isLoading } = useProduct(id);
	const product = useMemo(() => mapProduct(rawData?.product ?? rawData), [rawData]);

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

	const productId = product?.id;
	const wishlisted = productId ? isWishlisted(productId) : false;
	const isWishToggling = productId ? isToggling(productId) : false;

	const handleToggleWishlist = async () => {
		if (!isAuthenticated) {
			notyf.error('Faça login para usar a wishlist.');
			navigate('/auth');
			return;
		}
		if (!product) return;

		const result = await toggleWishlist({
			id: product.id,
			name: product.title,
			price: product.price,
			image: product.images?.[0],
			stock: product.stock,
			store: product.seller,
			rating: product.rating,
			reviewCount: product.reviews,
		});

		if (result.success) {
			if (result.inWishlist) notyf.success(result.msg || 'Adicionado à wishlist!');
			else notyf.error(result.msg || 'Removido da wishlist');
			return;
		}
		if (result.msg === 'not-authenticated') {
			notyf.error('Faça login para usar a wishlist.');
			navigate('/auth');
			return;
		}
		notyf.error(result.msg || 'Nao foi possivel atualizar a wishlist.');
	};

	useDocumentTitle(product ? product.title + ' - Kusumba' : 'Detalhes do Produto - Kusumba');

	useEffect(() => {
		if (!isAuthenticated || !productId || isWishlisted(productId)) return;
		checkInWishlist(productId);
	}, [checkInWishlist, isAuthenticated, isWishlisted, productId]);

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
					? <IoStarSharp key={i} className="text-yellow-400 text-lg" />
					: <IoStarOutline key={i} className="text-yellow-400 text-lg" />
			);
		}
		return stars;
	};

	if (isLoading) {
		return (
			<div className="bg-sand min-h-screen flex flex-col">
				<Header />
				<div className="max-w-[1200px] w-full mx-auto px-4 py-6 flex-1 animate-pulse">
					<div className="flex items-center gap-2 mb-6">
						<div className="w-16 h-4 bg-[#E8E2DA] rounded" />
						<IoChevronForward size={12} className="text-[#78716C]" />
						<div className="w-20 h-4 bg-[#E8E2DA] rounded" />
						<IoChevronForward size={12} className="text-[#78716C]" />
						<div className="w-48 h-4 bg-[#E8E2DA] rounded" />
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_320px] bg-white rounded-xl shadow-sm border border-[#1C1917]/5 overflow-hidden mb-8">
						<div className="flex gap-3 p-6 border-r border-[#1C1917]/10 items-start">
							<div className="flex flex-col gap-2">
								{[...Array(5)].map((_, i) => (
									<div key={i} className="w-14 h-14 bg-[#E8E2DA] rounded-lg" />
								))}
							</div>
							<div className="w-[340px] h-[400px] bg-[#E8E2DA] rounded-lg" />
						</div>

						<div className="p-6 border-r border-[#1C1917]/10">
							<div className="w-3/4 h-6 bg-[#E8E2DA] rounded mb-4" />
							<div className="w-1/2 h-6 bg-[#E8E2DA] rounded mb-6" />
							<div className="w-32 h-4 bg-[#E8E2DA] rounded mb-8 pb-4 border-b border-[#1C1917]/10" />
							<div className="w-40 h-10 bg-[#E8E2DA] rounded mb-4" />
							<div className="w-24 h-4 bg-[#E8E2DA] rounded mb-6" />
							<div className="w-3/4 h-16 bg-[#E8E2DA]/60 rounded mb-6" />
						</div>

						<div className="p-6 flex flex-col gap-4">
							<div className="w-full h-10 bg-[#E8E2DA]/60 rounded" />
							<div className="w-32 h-5 bg-[#E8E2DA] rounded mb-2" />
							<div className="w-full h-10 bg-[#E8E2DA] rounded border border-[#1C1917]/10" />
							<div className="w-full h-12 bg-[#E8E2DA] rounded-full mt-2" />
							<div className="w-full h-32 bg-[#E8E2DA]/60 rounded-xl mt-4 border border-[#1C1917]/10" />
						</div>
					</div>

					<div className="bg-white rounded-xl p-8 mb-4 shadow-sm border border-[#1C1917]/5">
						<div className="w-40 h-6 bg-[#E8E2DA] rounded mb-6" />
						<div className="space-y-3">
							<div className="w-full h-4 bg-[#E8E2DA] rounded" />
							<div className="w-full h-4 bg-[#E8E2DA] rounded" />
							<div className="w-5/6 h-4 bg-[#E8E2DA] rounded" />
							<div className="w-2/3 h-4 bg-[#E8E2DA] rounded" />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!product) {
		return (
			<div className="bg-sand min-h-screen flex flex-col">
				<Header />
				<div className="max-w-[1200px] mx-auto px-4 py-16 text-center flex-1 flex flex-col items-center justify-center">
					<div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-6">
						<IoStorefrontOutline size={36} className="text-accent" />
					</div>
					<h2 className="font-display text-3xl text-[#1C1917] mb-3">Produto não encontrado</h2>
					<p className="font-body text-[#78716C] mb-8">O produto que procura não existe ou foi removido.</p>
					<button
						onClick={() => navigate('/')}
						className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full font-display text-base hover:bg-accent-dark transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
					>
						Voltar à página inicial
					</button>
				</div>
			</div>
		);
	}

	const isAdding = product ? isAddingProduct(product.id) : false;

	return (
		<div className="bg-sand min-h-screen flex flex-col">
			<Header />

			<div className="max-w-[1200px] mx-auto px-4 py-6 w-full flex-1">
				{/* Breadcrumb */}
				<div className="flex items-center gap-2 mb-6 font-body text-sm text-[#78716C]">
					<button onClick={() => navigate('/')} className="text-accent hover:text-accent-dark transition-colors cursor-pointer">
						Início
					</button>
					<IoChevronForward size={12} className="text-[#78716C]" />
					<button onClick={() => navigate('/categorias')} className="text-accent hover:text-accent-dark transition-colors cursor-pointer">
						{product.category}
					</button>
					<IoChevronForward size={12} className="text-[#78716C]" />
					<span className="text-[#78716C]/60">{product.title.substring(0, 30)}...</span>
				</div>

				{/* Container Principal */}
				<div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_320px] bg-white rounded-xl shadow-sm border border-[#1C1917]/5 overflow-hidden mb-8 opacity-0 animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>

					{/* Coluna Esquerda — Imagens */}
					<div className="flex gap-3 p-6 border-r border-[#1C1917]/10 items-start">
						<div className="flex flex-col gap-2">
							{product.images.map((img, index) => (
								<button
									key={index}
									onClick={() => setSelectedImage(index)}
									className={`w-14 h-14 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 transition-all duration-200 ${
										selectedImage === index
											? 'ring-2 ring-accent ring-offset-1'
											: 'border border-[#1C1917]/10 hover:border-accent/40'
									}`}
								>
									<img
										src={img}
										alt={`${product.title} ${index + 1}`}
										className="w-full h-full object-cover"
										onError={(e) => { e.target.onerror = null; e.target.src = '/images/produto.png'; }}
									/>
								</button>
							))}
						</div>

						<div className="relative w-[340px] flex-shrink-0">
							<button
								onClick={handleToggleWishlist}
								title={wishlisted ? 'Remover da wishlist' : 'Adicionar à wishlist'}
								disabled={isWishToggling}
								className="absolute top-0 right-0 w-9 h-9 flex items-center justify-center z-10 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-[#1C1917]/10 hover:bg-white transition-all"
							>
								{isWishToggling ? (
									<span className="inline-block w-[18px] h-[18px] border-2 border-accent border-t-transparent rounded-full animate-spin" aria-label="Atualizando" />
								) : wishlisted ? (
									<IoHeart size={20} className="text-red-500" />
								) : (
									<IoHeartOutline size={20} className="text-[#78716C]" />
								)}
							</button>
							<img
								src={product.images[selectedImage]}
								alt={product.title}
								className="w-full h-[400px] object-contain"
								onError={(e) => { e.target.onerror = null; e.target.src = '/images/produto.png'; }}
							/>
						</div>
					</div>

					{/* Coluna Central — Informações */}
					<div className="p-6 border-r border-[#1C1917]/10">

						<h1 className="font-display text-2xl text-[#1C1917] mb-3 leading-tight">
							{product.title}
						</h1>

						<div className="flex items-center gap-3 mb-5 pb-5 border-b border-[#1C1917]/10">
							<span className="font-display text-lg font-bold text-[#1C1917]">{product.rating}</span>
							<div className="flex gap-0.5">
								{renderStars(Math.floor(product.rating))}
							</div>
							<span className="font-body text-sm text-accent cursor-pointer hover:underline">
								({product.reviews} avaliações)
							</span>
						</div>

						<div className="mb-4">
							{product.oldPrice && (
								<span className="font-body text-sm text-[#78716C] line-through">
									{formatCurrency(product.oldPrice)}
								</span>
							)}
							<div className="flex items-baseline gap-2 mt-1 mb-1">
								<span className="font-display text-4xl text-[#1C1917] leading-none font-bold">
									{Math.floor(product.price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
								</span>
								<span className="font-display text-lg text-[#1C1917] self-start mt-1">
									{`,${(product.price % 1).toFixed(2).slice(2)}`}
								</span>
								<span className="font-body text-sm text-[#78716C] self-end mb-0.5">Kz</span>
								{product.discount && (
									<span className="px-2.5 py-1 bg-accent/10 text-accent rounded-md font-display text-xs font-bold">
										{product.discount}% OFF
									</span>
								)}
							</div>
							{product.promotionEndDate && countdown && (
								<div className="flex items-center gap-3 mt-3 px-4 py-3 bg-orange-50 border border-orange-200 rounded-xl">
									<IoTimerOutline size={18} className="text-accent" />
									<span className="font-body text-xs text-accent font-semibold">Promoção termina em:</span>
									<div className="flex gap-1.5 items-center">
										{[{ label: 'dias', value: countdown.days }, { label: 'h', value: countdown.hours }, { label: 'min', value: countdown.minutes }, { label: 's', value: countdown.seconds }].map(({ label, value }) => (
											<div key={label} className="flex flex-col items-center">
												<span className="bg-accent text-white px-1.5 py-0.5 rounded-md font-display text-xs font-bold min-w-[24px] text-center">
													{String(value).padStart(2, '0')}
												</span>
												<span className="font-body text-[10px] text-accent mt-0.5">{label}</span>
											</div>
										))}
									</div>
								</div>
							)}
							{product.pricePerUnit && (
								<div className="font-body text-xs text-[#78716C] mt-1.5">
									{product.pricePerUnit}
								</div>
							)}
						</div>

						{product.coupon && (
							<div className="flex items-center gap-3 px-4 py-3 bg-accent/5 border border-accent/15 rounded-xl mb-5">
								<span className="bg-accent text-white px-2.5 py-0.5 rounded-md font-display text-xs font-bold whitespace-nowrap">
									🏷️ Cupom
								</span>
								<span className="font-body text-sm text-[#1C1917]">{product.coupon}</span>
							</div>
						)}

						{product.purchaseOptions && (
							<div className="pt-4 border-t border-[#1C1917]/10">
								<div className="font-display text-sm text-[#1C1917] mb-1.5">Opções de compra:</div>
								<span className="font-body text-sm text-accent cursor-pointer hover:underline">
									{product.purchaseOptions.count} produtos novos a partir de {formatCurrency(product.purchaseOptions.minPrice)}
								</span>
							</div>
						)}
					</div>

					{/* Coluna Direita — Ação + Loja */}
					<div className="p-6 flex flex-col gap-5">

						<div>
							<div className={`px-4 py-3 rounded-xl font-body text-sm font-medium mb-4 ${
								product.stock > 10
									? 'bg-accent/5 text-accent'
									: 'bg-orange-50 text-orange-700'
							}`}>
								{product.stock > 10
									? '✓ Em estoque'
									: `⚠ Últimas ${product.stock} unidades!`
								}
							</div>

							<div className="mb-4">
								<label className="block mb-2 font-display text-sm text-[#1C1917]">
									Quantidade:
								</label>
								<div className="inline-flex items-center border border-[#1C1917]/15 rounded-lg overflow-hidden bg-white">
									<button
										onClick={decrementQuantity}
										disabled={quantity <= 1}
										className="w-9 h-9 flex items-center justify-center border-none bg-transparent font-body text-base cursor-pointer disabled:cursor-not-allowed disabled:text-[#D4CFC9] text-[#1C1917] hover:bg-sand transition-colors"
									>
										−
									</button>
									<div className="min-w-[44px] h-9 flex items-center justify-center border-x border-[#1C1917]/10 font-body text-sm text-[#1C1917]">
										{quantity}
									</div>
									<button
										onClick={incrementQuantity}
										disabled={quantity >= product.stock}
										className="w-9 h-9 flex items-center justify-center border-none bg-transparent font-body text-base cursor-pointer disabled:cursor-not-allowed disabled:text-[#D4CFC9] text-[#1C1917] hover:bg-sand transition-colors"
									>
										+
									</button>
								</div>
								<div className="mt-1.5 font-body text-xs text-[#78716C]">
									({product.stock} disponíveis)
								</div>
							</div>

							<button
								onClick={handleAddToCart}
								disabled={product.stock === 0 || isAdding}
								className="w-full py-3.5 bg-accent text-white rounded-full font-display text-base font-bold tracking-wide shadow-lg hover:bg-accent-dark hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg flex items-center justify-center gap-2"
							>
								{isAdding && (
									<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full inline-block animate-spin" aria-label="Adicionando" />
								)}
								{isAdding ? 'Adicionando...' : 'Adicionar ao carrinho'}
							</button>

							<div className="pt-4 border-t border-[#1C1917]/10 mt-4 space-y-3">
								<div className="flex items-center gap-3">
									<IoShieldCheckmarkOutline size={16} className="text-accent" />
									<span className="font-body text-xs text-[#78716C]">Compra Segura Garantida</span>
								</div>
								<div className="flex items-center gap-3">
									<IoStorefrontOutline size={16} className="text-accent" />
									<span className="font-body text-xs text-[#78716C]">Devolução em 3 dias</span>
								</div>
							</div>
						</div>

						<div className="border border-[#1C1917]/10 rounded-xl overflow-hidden">
							<div className="bg-gradient-to-r from-accent to-accent-dark h-14 flex items-center justify-center">
								<span className="text-white font-display text-xs tracking-widest uppercase font-bold">LOJA OFICIAL</span>
							</div>
							<div className="p-4">
								<div className="flex items-center gap-3 mb-2">
									<img src={product.seller.logo} alt={product.seller.name} className="w-9 h-9 object-contain rounded-full border border-[#1C1917]/10" />
									<div className="flex-1 min-w-0">
										<div className="font-display text-sm font-semibold text-[#1C1917] truncate">{product.seller.name}</div>
									</div>
									<button
										onClick={() => product?.seller?.id && navigate(`/loja/${product.seller.id}`)}
										className="shrink-0 px-3 py-1.5 bg-transparent text-accent border border-accent/30 rounded-full font-display text-xs font-bold hover:bg-accent/5 hover:border-accent transition-all cursor-pointer"
									>
										Ver Mais
									</button>
								</div>
								{product.seller.experience && (
									<div className="font-body text-[10px] text-accent font-semibold mt-1">
										{product.seller.experience}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Descrição */}
				<div className="bg-white rounded-xl shadow-sm border border-[#1C1917]/5 p-8 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
					<h2 className="font-display text-xl text-[#1C1917] mb-6">Descrição</h2>
					<p className="font-body text-base text-[#78716C] leading-relaxed mb-0">
						{product.description}
					</p>
				</div>

				{/* Características Técnicas */}
				{product.specs.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-[#1C1917]/5 p-8 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
						<h2 className="font-display text-xl text-[#1C1917] mb-6">Características principais</h2>
						<div className="rounded-xl overflow-hidden border border-[#1C1917]/10">
							{product.specs.map((spec, index) => (
								<div
									key={index}
									className={`flex items-center px-6 py-3.5 ${index % 2 === 0 ? 'bg-sand' : 'bg-white'}`}
								>
									<span className="w-1/2 font-display text-sm font-semibold text-[#1C1917]">{spec.label}</span>
									<span className="w-1/2 font-body text-sm text-[#78716C]">{spec.value}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Avaliações do produto */}
				{product.opinions && product.opinions.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-[#1C1917]/5 p-8 mt-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
						<h2 className="font-display text-xl text-[#1C1917] mb-7">Avaliações dos clientes</h2>

						<div className="flex gap-10 items-center pb-7 border-b border-[#1C1917]/10 mb-7 flex-wrap">
							<div className="text-center min-w-[110px]">
								<div className="font-display text-6xl text-accent leading-none font-bold">{product.rating.toFixed(1)}</div>
								<div className="flex gap-1 justify-center my-2">
									{renderStars(Math.round(product.rating))}
								</div>
								<div className="font-body text-xs text-[#78716C]">{product.reviews} avaliações</div>
							</div>

							{product.ratingDistribution && (
								<div className="flex-1 min-w-[200px]">
									{[5, 4, 3, 2, 1].map((star) => {
										const total = Object.values(product.ratingDistribution).reduce((a, b) => a + b, 0);
										const count = product.ratingDistribution[star] || 0;
										const pct = total > 0 ? (count / total) * 100 : 0;
										return (
											<div key={star} className="flex items-center gap-2.5 mb-1.5">
												<span className="font-body text-xs text-[#78716C] w-10 text-right flex-shrink-0">{star} ★</span>
												<div className="flex-1 h-2 bg-[#E8E2DA] rounded-full overflow-hidden">
													<div
														className="h-full bg-yellow-400 rounded-full transition-all duration-500"
														style={{ width: `${pct}%` }}
													/>
												</div>
												<span className="font-body text-xs text-[#78716C] w-8 flex-shrink-0">{count}</span>
											</div>
										);
									})}
								</div>
							)}
						</div>

						{product.opinions.map((opinion, idx) => (
							<div key={opinion.id} className={`py-5 ${idx < product.opinions.length - 1 ? 'border-b border-[#1C1917]/10' : ''}`}>
								<div className="flex items-center gap-3 mb-3">
									<div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center font-display font-bold text-xs text-accent flex-shrink-0">
										{opinion.avatar || opinion.user.substring(0, 2).toUpperCase()}
									</div>
									<div>
										<div className="flex items-center gap-2 flex-wrap">
											<span className="font-display text-sm font-semibold text-[#1C1917]">{opinion.user}</span>
											{opinion.verified && (
												<span className="font-body text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-semibold">
													✓ Compra verificada
												</span>
											)}
										</div>
										{opinion.date && (
											<div className="font-body text-xs text-[#78716C]/60 mt-0.5">{opinion.date}</div>
										)}
									</div>
								</div>

								<div className="flex items-center gap-2 mb-2">
									<div className="flex gap-0.5">{renderStars(opinion.rating)}</div>
									<span className="font-display text-sm font-semibold text-[#1C1917]">{opinion.title}</span>
								</div>

								<p className="font-body text-sm text-[#78716C] leading-relaxed mb-3">{opinion.comment}</p>

								{opinion.helpful !== undefined && (
									<div className="flex items-center gap-2.5">
										<span className="font-body text-xs text-[#78716C]/60">Esta avaliação foi útil?</span>
										<button className="font-body text-xs px-3 py-1 border border-[#1C1917]/15 rounded-full bg-transparent cursor-pointer text-[#78716C] hover:border-accent/30 hover:text-accent transition-all">
											👍 Sim ({opinion.helpful})
										</button>
										<button className="font-body text-xs px-3 py-1 border border-[#1C1917]/15 rounded-full bg-transparent cursor-pointer text-[#78716C] hover:border-accent/30 hover:text-accent transition-all">
											👎 Não
										</button>
									</div>
								)}
							</div>
						))}

						<div className="mt-7 flex justify-center">
							<button className="px-8 py-3 bg-transparent text-accent border-2 border-accent/30 rounded-full font-display text-sm font-bold hover:bg-accent/5 hover:border-accent transition-all cursor-pointer">
								Ver todas as {product.reviews} avaliações
							</button>
						</div>
					</div>
				)}

				{/* Perguntas e Respostas */}
				{product.questions && product.questions.length > 0 && (
					<div className="bg-white rounded-xl shadow-sm border border-[#1C1917]/5 p-8 mt-4 mb-4 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
						<h2 className="font-display text-xl text-[#1C1917] mb-6">Perguntas e respostas</h2>

						<div className="mb-6">
							<h3 className="font-display text-base text-[#1C1917] mb-3">Qual a sua dúvida?</h3>
							<div className="relative">
								<input
									type="text"
									placeholder="Escreva sua pergunta..."
									className="w-full pl-4 pr-12 py-3 rounded-xl border border-[#1C1917]/15 font-body text-sm text-[#1C1917] placeholder:text-[#78716C]/50 focus:outline-none focus:border-accent/30 focus:ring-2 focus:ring-accent/10 transition-all"
								/>
								<IoSearch size={18} className="text-[#78716C]/50 absolute right-4 top-1/2 -translate-y-1/2" />
							</div>
						</div>

						<h3 className="font-display text-base text-[#1C1917] mb-4">Últimas perguntas</h3>
						{product.questions.map((q) => (
							<div key={q.id} className="mb-5">
								<div className="flex gap-2.5 items-start mb-2">
									<IoChatbubbleOutline size={16} className="text-[#78716C] mt-0.5 flex-shrink-0" />
									<p className="font-body text-sm text-[#1C1917] m-0">{q.question}</p>
								</div>
								<div className="flex gap-2.5 items-start pl-[26px]">
									<span className="text-accent font-display text-sm leading-none flex-shrink-0">↳</span>
									<p className="font-body text-sm text-[#78716C] leading-relaxed m-0">{q.answer}</p>
								</div>
							</div>
						))}
						<button className="mt-3 px-6 py-2.5 bg-transparent text-accent border-2 border-accent/30 rounded-full font-display text-sm font-bold hover:bg-accent/5 hover:border-accent transition-all cursor-pointer">
							Ver todas as perguntas
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default ProductDetails;
